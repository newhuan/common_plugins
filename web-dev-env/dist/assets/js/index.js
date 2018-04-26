import { getUrlParam } from './util/index';
import { test } from './request/index';
import cache from './cache/index';
import { getAvatar } from '../../components/Avatar/index';
import np from '../../components/toggleStyle';

const indexPath = './assets/images/index/';

function WEB() {
    this.init();
}

let wp = WEB.prototype;
$.extend( wp, np )

wp.init = function () {
    $( 'body' ).append( getAvatar( { src: `${indexPath}19.jpg`, classes: [ 'avatar' ] } ) );
    console.log( cache );
    this.initToggleStyle( true );
    test().then( res => {
        console.log( res , getUrlParam( "id" ) );
    } )
}

new WEB();