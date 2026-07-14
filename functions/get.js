import { prepFailResponse, prepSuccessResponse } from "../helperFunctions/boilerplateJsonResponse.js";
import getLatestDownloadLink from "../helperFunctions/latestSpreadsheetUrl.js"

export default async function getLink(){
    try {
        return prepSuccessResponse({
            ...await getLatestDownloadLink()
        })
    } catch (error) {
        console.error("Failed to retrieve the latest spreadsheet:", error);
        return prepFailResponse(500, {
            "message": "Something went wrong. Please try again later"
        })
    }
}
