function $id( id ) {
    return !!document.querySelector ? document.querySelector( "#" + id ) :
        document.getElementById( id );
}

function $class( className ) {
    return !!document.querySelector ? document.querySelector( "." + className ) :
        document.getElementsByClassName( className );
}
var ifCanClick = true;
var $showAlertBtn = $id( "show-alert" ),
    $showConfirmBtn = $id( "show-confirm" );
$showAlertBtn.addEventListener( "click", function () {
    if ( !ifCanClick ) {
        return;
    }
    ifCanClick = false;
    var clickNum = 0;
    var params = {
        type: "alert",
        title: "标题",
        msg: "内容",
        preSet: function ( $alertContainer ) {
            $alertContainer.dataId = "123";
        },
        sureCallback: function ( evt, res ) {
            if ( !clickNum ) {
                ++clickNum;
                params.type = "confirm";
                showMyTipTab( params );
            } else {
                if ( clickNum === 1 ) {
                    ++clickNum;
                    params.type = "prompt";
                    showMyTipTab( params );
                }
            }
            console.log( evt, res );
            ifCanClick = true
        },
        concelCallback: function () {
            ifCanClick = true
        }
    };
    showMyTipTab( params );
} );

/**
 * show my common alert
 * @param { Object } params params for alert include type, title, msg, isAble, sureCallback, concelCallback, preSet
 * @returns { String } alertId id of this alert tab 
*/
function showMyTipTab( params ) {
    if ( !params ) {
        return false;
    }
    var type = params.type || "alert",
        title = params.title || "",
        msg = params.msg || "",
        //if sure btn can be clicked, default value: can
        isAble = typeof params.isAble === "undefined" ? true : params.isAble,
        sureCallback = params.sureCallback,
        concelCallback = params.concelCallback,
        preSet = params.preSet,
        alertId = "alert" + String.prototype.slice.apply( Date.now(), [ 4 ] ) + parseInt( Math.random() * 1000 ),
        $alertBtnContainer = document.createElement( "div" ),
        $alertContainer = document.createElement( "div" ),
        $alertMainArea = document.createElement( "div" ),
        $alertTitle = document.createElement( "div" ),
        $alertMsg = document.createElement( "p" ),
        $sureBtn = document.createElement( "button" );
    var defaultSureHandler = function() {
        $alertContainer.remove();
    };
    if ( typeof preSet === "function" ) {
        preSet( $alertContainer );
    }

    $alertContainer.append( $alertMainArea );
    if ( !!title ) {
        $alertMainArea.append( $alertTitle );
    } else {
        $alertMsg.className = $alertMsg.className + " alert-msg-without-title";
    }

    $alertMainArea.append( $alertMsg );
    switch ( type ) {
        case "alert":
            setAlert();
            break;
        case "confirm":
            setConfirm();
            break;
        case "prompt":
            setPrompt();
            break;
        default:
            setAlert();
    }

    $alertMainArea.append( $alertBtnContainer );
    function setConfirm() {
        var $concelBtn = document.createElement( "button" );
        $concelBtn.innerHTML = "取消";
        $concelBtn.className = "alert-btn alert-concel-btn";
        $alertBtnContainer.append( $sureBtn );
        $alertBtnContainer.append( $concelBtn );

        $sureBtn.addEventListener( "click", function ( evt ) {
            var e  = evt || window.event;
            if ( ~e.target.className.indexOf( "disabled-btn" ) ) {
                return;
            }
            if ( typeof sureCallback === "function" ) {
                sureCallback( evt );
            }
            defaultSureHandler();
        } );
        $concelBtn.addEventListener( "click", function () {
            if ( typeof concelCallback === "function" ) {
                concelCallback();
            }
            defaultSureHandler();
        } );
    }

    function setAlert() {
        $alertBtnContainer.append( $sureBtn );
        $sureBtn.addEventListener( "click", function ( evt ) {
            var e  = evt || window.event;
            if ( ~e.target.className.indexOf( "disabled-btn" ) ) {
                return;
            }
            if ( typeof sureCallback === "function" ) {
                sureCallback( evt );
            }
            defaultSureHandler();
        } );
    }
    
    function setPrompt() {
        var $promptInput = document.createElement( "input" );
        $promptInput.className = "prompt-input";
        $alertMainArea.append( $promptInput );
        var $concelBtn = document.createElement( "button" );
        $concelBtn.innerHTML = "取消";
        $concelBtn.className = "alert-btn alert-concel-btn";
        $alertBtnContainer.append( $sureBtn );
        $alertBtnContainer.append( $concelBtn );
        $sureBtn.addEventListener( "click", function ( evt ) {
            var e  = evt || window.event;
            if ( ~e.target.className.indexOf( "disabled-btn" ) ) {
                return;
            }
            if ( typeof sureCallback === "function" ) {
                sureCallback( evt, $promptInput.value );
            }
            defaultSureHandler();
        } );
        $concelBtn.addEventListener( "click", function () {
            if ( typeof concelCallback === "function" ) {
                concelCallback();
            }
            defaultSureHandler();
        } );
    }

    $alertContainer.id = alertId;
    $alertContainer.className = "alert-container";
    $alertMainArea.className = "alert-main-area";
    $alertTitle.className = "alert-title";
    $alertMsg.className = "alert-msg";
    $alertBtnContainer.className = "alert-btn-container";
    $sureBtn.className = "alert-btn alert-sure-btn";
    if ( !isAble ) {
        $sureBtn.className += " disabled-btn";
    }

    $alertTitle.innerHTML = title;
    $alertMsg.innerHTML = msg;
    $sureBtn.innerHTML = "确定";

    document.querySelector( "body" ).append( $alertContainer );
    return alertId;
}

/**
 * hide common alert by alertId
 * @param { String } alertId id of alert-container
 * @returns {}
*/
function hideAlertById( alertId ) {
    return !!$id( alertId ) ? $id( alertId ).remove() : "";
}