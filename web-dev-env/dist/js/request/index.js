import qs from 'qs';
import { getFackDatas } from './fakeDatas';
export function getRequestPromise( params ) {
    let { url, type, data } = params;
    data = data || {};
    let headers = params.headers || undefined;
    let timeout = params.timeout || 1000 * 20;
    let contentType = params.contentType || "application/x-www-form-urlencoded; charset=UTF-8";
    let axiosConfig = {
        url,
        method: type,
        headers: {
            ...headers,
            "Content-Type": contentType,
        },
        timeout
    };
    if ( type.toLowerCase() === 'get' ) {
        axiosConfig.params = data;
    } else {
        if ( !params.contentType ) {
            axiosConfig.data = qs.stringify( data );
        } else if ( params.contentType === 'application/json' ) {
            axiosConfig.data = data;
        } else {
            axiosConfig.data = qs.stringify( data );
        }
    }

    //TODO:: delete fack data when using prd env
    params.key && ( axiosConfig.key = params.key );
    return getFackDatas( axiosConfig )

    return axios( axiosConfig ).then( res => {
        let { data } = res;
        fliterResponse( data, axiosConfig );
        return data;
    } )
}

export function requestWithToken( params ) {
    let token = window.serToken;
    if ( !!params.headers ) {
        params.headers = {
            ...params.headers,
            token
        }
    } else {
        params.headers = {
            token
        }
    }
    return getRequestPromise( params );
}

function fliterResponse( data, axiosConfig ) {
    let { msgId } = data;
    if ( msgId === '401' ) {
        console.log( 'token expired' );
    }
}

export { test } from './test';
