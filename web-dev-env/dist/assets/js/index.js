import { getUrlParam } from './util/index';
import { test } from './request/index';
import cache from './cache/index';
import { getAvatar } from '../../components/Avatar';
import { getInputItem } from '../../components/InputItem'
import np from '../../components/toggleStyle';
import nav from '../../components/nav';

const indexPath = './assets/images/index/';

function WEB() {
    this.init();
}

let wp = WEB.prototype;
$.extend( wp, np )
$.extend( wp, nav )

wp.init = function () {
    $( 'body' ).append( getAvatar( { src: `${indexPath}19.jpg`, classes: [ 'avatar' ] } ) );
    $( 'body' ).append( getInputItem( { key: "key", id:"key", value: "value" } ) );
    $( 'body' ).append( this.getNav( { title: "title", callback: () => console.log(1) } ) );
    console.log( cache );
    this.initToggleStyle( true );
    test().then( res => {
        console.log( res , getUrlParam( "id" ) );
    } )
}

new WEB();