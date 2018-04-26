import { confirmTpl } from "./tpl_confirm";
let confirm = {}
confirm.confirm = function ( params ) {
    let $item = $( confirmTpl ),
        $cover = $item,
        $container = $item.find( ".confirm-container" ),
        $body = $item.find( ".confirm-body" ),
        $concel = $item.find( ".confirm-concel" ),
        $concelImg = $item.find( ".confirm-concel img" ),
        $submit = $item.find( ".confirm-submit" ),
        $text = $item.find( ".confirm-text" );
    $text.text( params.text );
    $concel.on( "click", function () {
        $item.remove();
    } );
    $submit.on( "click", function () {
        $item.remove();
        typeof params.callback === "function" ? params.callback() : "";
    } );
    $cover.attr( "style", "position:fixed;width:100%;height:100%;background-color:transparent;z-index:999;" );
    //style
    if ( !params.type ) {
        $container.attr( "style", 'width:8.4rem;height:3.04rem;position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);box-shadow:0 0 .13333rem 0 rgba(0,0,0,0.1);background-color:white;z-index:9;border-radius:.21333rem;' );
        $body.attr( "style", 'width:100%;height:2.4rem;position:relative' );
        $text.attr( "style", 'position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);width:100%;line-height:.58667rem;font-size:.37333rem;text-align:center;color:black;' );
        $concel.attr( "style", 'width:1.33333rem;height:1.33333rem;position:absolute;bottom:-.66667rem;left:.85333rem;box-shadow:0 0 .13333rem 0 rgba(0,0,0,0.1);border-radius:50%;background-color:white;' );
        $concelImg.attr( "style", 'display:block;width:.37333rem;height:.34667rem;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%)' );
        $submit.attr( "style", 'width:4.53333rem;height:1.33333rem;border-radius:.66667rem;background-color:#fd95bb;color:white;font-size:.34667rem;text-align:center;line-height:1.33333rem;position:absolute;bottom:-.66667rem;left:2.98667rem' );
    } else if ( params.type === "jnbg" ) {
        $container.attr( "style", 'width:31.5rem;height:11.4rem;position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);box-shadow:0 0 .5rem 0 rgba(0,0,0,0.1);background-color:white;z-index:9;border-radius:.8rem;' );
        $body.attr( "style", 'width:100%;height:9rem;position:relative' );
        $text.attr( "style", 'position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);width:100%;line-height:2.2rem;font-size:1.4rem;text-align:center;color:black;' );
        $concel.attr( "style", 'width:5rem;height:5rem;position:absolute;bottom:-2.5rem;left:3.2rem;box-shadow:0 0 .5rem 0 rgba(0,0,0,0.1);border-radius:50%;background-color:white;' );
        $concelImg.attr( "style", 'display:block;width:1.4rem;height:1.3rem;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%)' );
        $submit.attr( "style", 'width:17rem;height:5rem;border-radius:2.5rem;background-color:#fd95bb;color:white;font-size:1.3rem;text-align:center;line-height:5rem;position:absolute;bottom:-2.5rem;left:11.2rem' );
    }
    $( "body" ).prepend( $item );
    // return $item;
}

export default confirm;