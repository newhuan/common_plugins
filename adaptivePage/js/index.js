let HomePage = function () {
    this.init();
}

let hp = HomePage.prototype;

hp.init = function () {
    this.initData();
    this.initMateElement();
    this.getViewType();
    this.initNodes();
    this.initEvents();
}

hp.initData = function () {
    this.viewType = 1200;
    this.styleUrl = {
        s768: "./css/s768.css",
        s1200: "./css/s1200.css"
    }
}

hp.initMateElement = function () {
    !function ( window, lib ) {
        var d,
            doc = window.document,
            docEl = doc.documentElement;
        function clear$meta() {
            var $meta = doc.querySelector('meta[name="viewport"]');
            if ( !!$meta ) {
                $meta.parentNode.removeChild( $meta );
            }
        }

        function refreshRem() {
            var DPR = dpr;
            initDPRandScaleByDevice();
            var currentDRP = dpr;
            if ( DPR !== currentDRP ) {
                clear$meta();
                init$Meta();
            }
            var lib = docEl.getBoundingClientRect().width;
            lib / dpr > 540 && (lib = 540 * dpr);
            var rem = lib / 10;
            docEl.style.fontSize = rem + "px";
            flexible.rem = window.rem = rem;
        }
        clear$meta();
        var $metaViewport = doc.querySelector('meta[name="viewport"]'),
            $metaflexible = doc.querySelector('meta[name="flexible"]'),
            dpr = 0,
            scale = 0,
            flexible = lib.flexible || (lib.flexible = {});
        if ( $metaViewport ) {
            console.warn("将根据已有的meta标签来设置缩放比例");
            var metaScale = $metaViewport.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
            metaScale && (scale = parseFloat(l[1]), dpr = parseInt(1 / scale))
        } else if ( $metaflexible ) {
            var m = $metaflexible.getAttribute("content");
            if ( m  ) {
                var n = m.match(/initial\-dpr=([\d\.]+)/),
                    o = m.match(/maximum\-dpr=([\d\.]+)/);
                n && (dpr = parseFloat(n[1]), scale = parseFloat((1 / dpr).toFixed(2))),
                o && (dpr = parseFloat(o[1]), scale = parseFloat((1 / dpr).toFixed(2)))
            }
        }
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
        function init$Meta() {
                $metaViewport = doc.createElement( "meta" );
                $metaViewport.setAttribute( "name", "viewport" );
                $metaViewport.setAttribute( "content", "initial-scale=" + scale + ", maximum-scale=" + scale + ", minimum-scale=" + scale + ", user-scalable=no" );
                if ( docEl.firstElementChild ) {
                    docEl.firstElementChild.appendChild( $metaViewport );
                } else {
                    var $metaContainer = doc.createElement( "div" );
                    $metaContainer.appendChild( $metaViewport );
                    doc.write( $metaContainer.innerHTML );
                }
            }
        if ( !$metaViewport ) {

            init$Meta();
        }
        window.addEventListener("resize", function () {
            clearTimeout( d );
            d = setTimeout( refreshRem, 300 );
        }, !1);
        window.addEventListener( "pageshow", function ( evt ) {
            if ( !!evt.persisted ) {
                clearTimeout( d );
                d = setTimeout( refreshRem, 300 );
            }
        }, !1);
        if ( doc.readyState === "complete" ) {
            doc.body.style.fontSize = 12 * dpr + "px";
        } else {
            doc.addEventListener( "DOMContentLoaded", function () {
                doc.body.style.fontSize = 12 * dpr + "px";
            }, !1 );
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

hp.getViewType = function () {
    //缩放会影响媒体查询的结果
    let viewWith = this.getDeviceWidth();
    if( viewWith > 1199 ) {
        this.viewType = 1200;
        $(".style").attr( "href",  this.styleUrl[ "s1200" ] );
    } else if( viewWith < 769 ) {
        this.viewType = 768;
         $(".style").attr( "href",  this.styleUrl[ "s768" ] );
    } else {
        this.viewType = 768;
        $(".style").attr( "href",  this.styleUrl[ "s768" ] );
    }
}

hp.getDeviceWidth = function () {
    var i = 0,
        j = 0,
        userAgent = window.navigator.userAgent,
        isMobileDevice = ( !!userAgent.match( /android/gi ) || !!userAgent.match( /iphone/gi ) || !!userAgent.match( /pad/gi ) ),
        isOS9p3 = isMobileDevice && !!userAgent.match(/OS 9_3/),
        dpr = window.devicePixelRatio;
    i = isMobileDevice && !isOS9p3
        ? dpr >= 3 && (!i || i >= 3)
            ? 3 : dpr >= 2 && (!i || i >= 2)
                ? 2
                : 1
        : 1,
        j = 1 / i;
    this.j = j;
    return j *  document.documentElement.getBoundingClientRect().width;
}

hp.initNodes = function () {
    this.$style = $( ".style" );
}

hp.initEvents = function () {
    $( window ).on( "resize", this.getViewType.bind( this ) );
}

$( window ).on( "load", function () {
    let homePage = new HomePage();
} );