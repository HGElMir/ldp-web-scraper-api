import axios from "axios";
import * as cheerio from "cheerio";

const ROOT_URL = "https://moph.gov.lb";
const PRICE_LIST_URL = `${ROOT_URL}/en/Pages/3/3101/drugs-public-price-list-`;
const READER_URL = `https://r.jina.ai/${PRICE_LIST_URL}`;
const SPREADSHEET_PATH = /\/DrugsPublicPriceList\/.*\/WebMarketed[^/]*\.xlsx?$/i;
const REQUEST_HEADERS = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        + "AppleWebKit/537.36 (KHTML, like Gecko) "
        + "Chrome/138.0.0.0 Safari/537.36",
};

export function parseLatestDownloadLink(html, rootUrl = ROOT_URL) {
    const $ = cheerio.load(html);
    const spreadsheetLink = $("a").filter((_, element) => {
        const link = $(element);
        const label = link.text().replace(/\s+/g, " ").trim();
        const path = link.attr("href") || "";

        return label === "Drugs Public Price List" && SPREADSHEET_PATH.test(path);
    }).first();
    const path = spreadsheetLink.attr("href");

    if (!path) {
        throw new Error("Failed to get latest spreadsheet link.");
    }

    const heading = spreadsheetLink.closest("ul").prevAll("div").first().text();
    const headingDate = heading.match(/\b\d{1,2}\/\d{1,2}\/\d{4}\b/)?.[0];
    const pathDate = path.match(/\/(\d{1,2}-\d{1,2}-\d{4})\//)?.[1]
        ?.replaceAll("-", "/");

    return {
        downloadLink: new URL(path, rootUrl).href,
        date: headingDate || pathDate,
    };
}

export function parseLatestDownloadLinkFromMarkdown(markdown) {
    const linkMatch = markdown.match(
        /\[Drugs Public Price List\]\((https?:\/\/[^)\s]*\/DrugsPublicPriceList\/[^)\s]*\/WebMarketed[^)\s]*\.xlsx?)\)/i,
    );
    const date = markdown.match(
        /Drugs Prices According to the Exchange Rate Issued on (\d{1,2}\/\d{1,2}\/\d{4})/i,
    )?.[1];

    if (!linkMatch) {
        throw new Error("Failed to get latest spreadsheet link from reader fallback.");
    }

    return {
        downloadLink: linkMatch[1],
        date,
    };
}

export default async function getLatestDownloadLink() {
    try {
        const { data } = await axios.get(PRICE_LIST_URL, {
            headers: REQUEST_HEADERS,
            timeout: 15_000,
        });

        return parseLatestDownloadLink(data);
    } catch (error) {
        if (error.response?.status !== 403) {
            throw error;
        }

        console.warn("MOPH blocked the direct request; using the reader fallback.");
        const { data } = await axios.get(READER_URL, { timeout: 20_000 });

        return parseLatestDownloadLinkFromMarkdown(data);
    }
}
