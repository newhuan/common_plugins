import { navTpl } from "./tpl_nav";
let nav = {
    getNav: function ( { backUrl, callback, title } ) {
        let $item = $( navTpl );
        let $title = $item.find( ".title" )
        $title.text( title );
        if ( !!backUrl ) {
            $item.find( ".back" ).on( "click", function () {
                location.href = backUrl;
            } );
        } else {
            $item.find( ".back" ).on( "click", function () {
                try {
                    !!callback && callback();
                } catch( e ) {
                    console.error( "backError: ", e );
                }
            } );
        }
        return $item;
    },

    changeNav: function ( { $item, newUrl, callback, title } ) {
        $item.find( ".back" ).off( 'click' );
        !!title && $item.find( '.title' ).text( title );
        if ( !!callback ) {
            $item.find( ".back" ).on( 'click', callback );
            return;
        }
        if ( !!newUrl ) {
            $item.find( ".back" ).on( "click", function () {
                location.href = newUrl;
            } );
        } else {
            $item.find( ".back" ).on( "click", function () {
                try {
                    nativeBridge.backToApp();
                } catch( e ) {
                    console.error( "backError: ", e );
                }
            } );
        }
    },

    initNavEle: function () {
        $( "body" ).prepend( this.getNavHtml( { title: "", backUrl: this.backUrl } ) );
    }
}

export default nav;