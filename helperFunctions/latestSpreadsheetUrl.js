import axios from "axios";
import * as cheerio from "cheerio";

const ROOT_URL = "https://moph.gov.lb";
const PRICE_LIST_URL = `${ROOT_URL}/en/Pages/3/3101/drugs-public-price-list-`;
const SPREADSHEET_PATH = /\/DrugsPublicPriceList\/.*\/WebMarketed[^/]*\.xlsx?$/i;

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

export default async function getLatestDownloadLink() {
    const { data } = await axios.get(PRICE_LIST_URL, { timeout: 15_000 });

    return parseLatestDownloadLink(data);
}
