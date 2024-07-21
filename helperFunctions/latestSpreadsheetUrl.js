import axios from "axios";
import * as cheerio from "cheerio";

export default async function getLatestDownloadLink(){
    const rootUrl = "https://moph.gov.lb"
    const url = `${rootUrl}/en/Pages/3/3101/drugs-public-price-list-`;

    const {data} = await axios.get(url)

    const $ = cheerio.load(data);

    const selectionLink = "div table.contentTable a"
    const selectionDate = "div table.contentTable td"
    const path = $(selectionLink).first().attr("href");

    const date = $(selectionDate).first().text()

    if (path){
        console.warn(rootUrl + path)
        return {"downloadLink" :rootUrl + path,
            "date": date
        };
    }
    else{
        const ERROR = "Failed to get latest spreadsheet link."
        console.error(ERROR)
        console.trace()
        throw Error(ERROR);
    }
    
}