import axios from "axios";
import * as cheerio from "cheerio";

export default async function getLatestDownloadLink(){
    const rootUrl = "https://moph.gov.lb"
    const url = `${rootUrl}/en/Pages/3/3101/drugs-public-price-list-`;

    const {data} = await axios.get(url)

    const $ = cheerio.load(data);

    const sel = "div table.contentTable a"
    const path = $(sel).first().attr("href");

    if (path){
        console.warn(rootUrl + path)
        return rootUrl + path;
    }
    else{
        const ERROR = "Failed to get latest spreadsheet link."
        console.error(ERROR)
        console.trace()
        throw Error(ERROR);
    }
    
}