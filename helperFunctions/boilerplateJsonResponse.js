import { API_VERSION } from "../constants.js";

export function prepSuccessResponse(info){
    return {
        "status": 200,
        "version": API_VERSION,
        ...info
    }
}

export function prepFailResponse(statusCode, info){
    return {
        "status": statusCode,
        "version": API_VERSION,
        ...info
    }
}