let np = {};

np.initToggleStyle = function ( ifAddMetaEle ) {
    this.initTSNodes();
    this.checkDevice();
    this.initTSEvents( ifAddMetaEle );
    this.initMateElement( ifAddMetaEle );//if page does not have meta element, run this function in init func
}

np.initTSNodes = function () {
    this.$style = $( ".style" );
}

np.initTSEvents = function ( ifAddMetaEle ) {
    $( window ).on( "resize", this.initMateElement.bind( this,ifAddMetaEle ) );
    $( window ).on( "load", this.initMateElement.bind( this, ifAddMetaEle ) );
}

np.checkDevice = function () {
    var userAgent = window.navigator.userAgent,
        isIphone = /iphone|ipod|ipad/gi.test( userAgent );
    if ( isIphone ) {
        $( "body" ).addClass( "in-ios" );
    } else {
        $( "body" ).removeClass( "in-ios" );
    }
}

np.initMateElement = function ( ifAddMetaEle ) {
    !function ( window, lib ) {
        var d,
            doc = window.document,
            docEl = doc.documentElement;
        function refreshRem() {
            var DPR = dpr;
            initDPRandScaleByDevice();
            var currentDRP = dpr;
            var lib = docEl.getBoundingClientRect().width;
            lib / dpr > 540 && (lib = 540 * dpr);
            var rem = lib / 10;
            docEl.style.fontSize = rem + "px";
            flexible.rem = window.rem = rem;
        }
        var $metaViewport = doc.querySelector('meta[name="viewport"]'),
            $metaflexible = doc.querySelector('meta[name="flexible"]'),
            dpr = 0,
            scale = 0,
            flexible = lib.flexible || (lib.flexible = {});
        function initDPRandScaleByDevice() {
                //这里只针对ios的视网膜屏做了高清处理，所有android和web设备还是默认dpr为1处理
                //安卓为了塞更多，ios为了显示的更清晰
                //如果只对移动设备做适配，这么写没什么问题
                var userAgent = window.navigator.userAgent,
                    isIphone = (!!userAgent.match(/android/gi), !!userAgent.match(/iphone/gi)),
                    isIphoneOS9_3 = isIphone && !!userAgent.match(/OS 9_3/),
                    deviceDPR = window.devicePixelRatio;
                dpr = isIphone && !isIphoneOS9_3 ?
                    ( deviceDPR >= 3 ? 3 :
                        ( deviceDPR >= 2 ? 2 : 1 ) )
                    : 1;
                scale = 1 / dpr;
                docEl.setAttribute("data-dpr", dpr);
            }
        if (!dpr && !scale) {
            initDPRandScaleByDevice();
        }
        if ( doc.readyState === "complete" ) {
            doc.body.style.fontSize = 12 * dpr + "px";
        } else {
            doc.addEventListener( "DOMContentLoaded", function () {
                doc.body.style.fontSize = 12 * dpr + "px";
            }, !1 );
        }

        function clear$meta() {
            var $meta = doc.querySelector('meta[name="viewport"]');
            if ( !!$meta ) {
                $meta.parentNode.removeChild( $meta );
            }
        }
        function init$Meta() {
            $metaViewport = doc.createElement( "meta" );
            $metaViewport.setAttribute( "name", "viewport" );
            $metaViewport.setAttribute( "content", "initial-scale=" + scale + ", maximum-scale=" + scale + ", minimum-scale=" + scale + ", user-scalable=no" );
            // console.log( scale )
            if ( docEl.firstElementChild ) {
                docEl.firstElementChild.appendChild( $metaViewport );
            } else {
                var $metaContainer = doc.createElement( "div" );
                $metaContainer.appendChild( $metaViewport );
                doc.write( $metaContainer.innerHTML );
            }
        }
        if ( ifAddMetaEle )  {
            clear$meta();
            init$Meta();
        }

        refreshRem();
        flexible.dpr = window.dpr = dpr;
        flexible.refreshRem = refreshRem;
        flexible.rem2px = function ( rem ) {
            var lib = parseFloat( rem ) * this.rem;
            return "string" == typeof rem && rem.match(/rem$/) && (lib += "px"), lib
        };
        flexible.px2rem = function ( px ) {
            var lib = parseFloat( px ) / this.rem;
            return "string" == typeof px && px.match(/px$/) && (lib += "rem"), lib
        }
    }( window, window.lib || ( window.lib = {} ) );
}

export default np;