import { API_URL } from '../../../config/consts.js'
import { getUrl } from "../../../config/index";

export const datas = {
    [ API_URL ]: {
        msgId: "200"
    }
}

export function getFackDatas( config ) {
    console.log( config )
    return Promise.resolve( datas[ config.key ] );
}