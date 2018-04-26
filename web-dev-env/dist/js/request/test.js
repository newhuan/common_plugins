import {requestWithToken} from "./index";
import {getUrl} from "../../config";
import {API_URL} from "../../config/consts";

export function test() {
    let key = API_URL;
    return requestWithToken( {
        key,
        url: getUrl( key ),
        data: {},
        type: "get"
    } );
}