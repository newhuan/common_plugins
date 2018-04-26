export function getAvatar( { src, name = "", classes } ) {
    classes = classes.join( ' ' );
    let tpl = `<div class = "${classes} fillAvatarWithFlex-img-container">
         <img src="${src}" alt="${name}" title="${name}"/>
     </div>`,
        $item = $( tpl );
    $item.find( 'img' ).load( fillAvatarWithFlex );
    return $item.get( 0 );
}

export function fillAvatarWithFlex ( e ) {
    let target = ( e || window.event ).target,
        className = target.className;
    className = className.replace( /\svertical\-middle|\shorizontal\-middle/g, "" );
    if ( target.width <= target.height ) {
        className += " vertical-middle";
    } else {
        className += " horizontal-middle";
    }
    target.className = className;
}