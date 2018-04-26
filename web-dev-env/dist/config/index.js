import {API_URL} from './consts';
// let env = 'prd';
let env = 'dev';
let root = `https://${ env === 'prd' ? "" : "dev" }api.mitures.com/`;

let config = {
    root,
    urls: {
        [ API_URL ]: ( { param="" } ) => `request/with/${param}`
    }
}

export function getUrl( key, params = {} ) {
    return root + config.urls[ key ]( params );
}

export default config;