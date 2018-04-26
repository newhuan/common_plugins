import { getAvatar } from '../components/Avatar/index';
import { getUrlParam } from './util';
import { test } from './request';
import cache from './cache';

const indexPath = './assets/images/index/';

function WEB() {
    this.init();
}

let wp = WEB.prototype;

wp.init = function () {
    $( 'body' ).append( getAvatar( { src: `${indexPath}19.jpg`, classes: [ 'avatar' ] } ) );
    console.log( cache );
    test().then( res => {
        console.log( res , getUrlParam( "id" ) );
    } )
}

new WEB();