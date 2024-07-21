import { prepFailResponse, prepSuccessResponse } from "../helperFunctions/boilerplateJsonResponse.js"


export function statusCheck(){
        return prepSuccessResponse({
            "operational": true 
        })
}