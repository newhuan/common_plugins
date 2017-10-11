let { urls } = require("./modules/urls");
let {  onLoadComplete, dataHandler, evaluteAfterLoad } = require( "./modules/spider_functions" );
const phantom = require('phantom');


(async function () {
    const key = "kNsgGmwEnCN6TPCmw4xu";
    let isImplemented = false; // function is implemented
    let loaded = false;//url hac changed
    let idx = 0;
    let evalutedTime = 0;
    const instance = await phantom.create(['--ignore-ssl-errors=yes', '--load-images=no']);
    const page = await instance.createPage();
    //trigger lazy load
    page.property( 'viewportSize' , { width: 1600, height: 10000, } );
    await page.on('onResourceRequested', function (requestData) {
        // console.info('Requesting', requestData.url);
    });
    await page.on('onConsoleMessage', function (msg) {
        if ( ~msg.indexOf( key ) ) {
            var trueMsg = msg.slice( 20 ),
                data = JSON.parse( trueMsg );
            dataHandler( data.slice( 0 ) );
            // page.close();
        } else {
            console.log( msg );
            if ( msg === "pageIsLoaded" ) {
                loaded = false;
                isImplemented = false;
                ++idx;
            }
        }
    });
    await onLoadComplete( page, function ( err, page ) {
        if ( err ) {
            console.log( "loadCompleted error", err );
        } else {
            console.log("pageIsLoading");
            // page.evaluate( evaluteAfterLoad );
        }
    } );


    setTimeout( async function openPage() {
        if ( !urls[ idx ] ) {
            phantom.exit();
            return;
        }
        console.log( "loaded:", loaded, isImplemented, idx === 0 ? urls[ idx ] : urls[ idx - 1 ] );
        if ( !loaded ) {
            loaded = true;
            console.log("openANewPage");
            await page.open( urls[ idx ] );
        }
        if ( loaded  ) {
            await page.evaluate( evaluteAfterLoad );
            console.log( "evaluated" );
            isImplemented = true;
            ++evalutedTime;
            if ( evalutedTime > 10 ) {
                //执行10次还未成功爬到数据则跳过此页面直接开始下个页面
                evalutedTime = 0;
                loaded = false;
                isImplemented = false;
                ++idx;
            }
        }
        setTimeout( openPage, 1000 );
    } ,1000);
})();
