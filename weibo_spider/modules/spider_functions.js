// let newss = [];
let {pg_pool, pg_opeartor} = require("./modules/pg_conn");
async function save_to_db(news) {
    // newss.push( news );
    // newss  = Array.from( new Set( newss ) );
    // console.log( "newss: ", newss.length );
    const res = await pg_pool.query("insert into weibo_spider_content (words, srcs, type, id) values ($1, $2, $3, $4) ",
        [news.words,JSON.stringify(news.srcs),news.type, news.id]
    , (err, result)=> {
            if (err) {
              return console.error( "插入错误", err );
            }
            console.log( "insert success: ", news );
        });
}

function onLoadComplete(page, callback){
    var waiting = [];  // request id
    var interval = 600;  //ms time waiting new request
    var timer = setTimeout( timeout, interval);
    var max_retry = 3;  //
    var counter_retry = 0;
    // var callbackTime = 0;
    // var callbacked = false;

    function timeout(){
        if(waiting.length && counter_retry < max_retry){
            timer = setTimeout( timeout, interval);
            counter_retry++;
            return;
        }else{
            try{
                callback(null, page);
            }catch(e){}
        }
    }

    //for debug, log time cost
    var tlogger = {};

    bindEvent(page, 'request', function(req){
        waiting.push(req.id);
    });

    bindEvent(page, 'receive', function (res) {
        var cT = res.contentType;
        if(!cT){
            // console.log('[contentType] ', cT, ' [url] ', res.url);
        }
        if(!cT) return remove(res.id);
        if(cT.indexOf('application') * cT.indexOf('text') != 0) return remove(res.id);

        if (res.stage === 'start') {
            // console.log('!!received start: ', res.id);
            //console.log( JSON.stringify(res) );
            tlogger[res.id] = new Date();
        }else if (res.stage === 'end') {
            // console.log('!!received end: ', res.id, (new Date() - tlogger[res.id]) );
            //console.log( JSON.stringify(res) );
            remove(res.id);

            clearTimeout(timer);
            timer = setTimeout(timeout, interval);
        }

    });

    bindEvent(page, 'error', function(err){
        remove(err.id);
        if(waiting.length === 0){
            counter_retry = 0;
        }
    });

    function remove(id){
        var i = waiting.indexOf( id );
        if(i < 0){
            return;
        }else{
            waiting.splice(i,1);
        }
    }

    function bindEvent(page, evt, cb){
        switch(evt){
            case 'request':
                page.on("onResourceRequested" , cb);
                break;
            case 'receive':
                page.on("onResourceReceived" , cb);
                break;
            case 'error':
                page.on("onResourceError" , cb);
                break;
            case 'timeout':
                page.on("onResourceTimeout" , cb);
                break;
        }
    }
}

function trim( str ) {
    var reg = /^\s+|\s+$/g;
    return str.replace(reg, '');
}


function dataHandler( data ) {
    // console.log( "wordsHandler", words );
    data.forEach( function ( item, index ) {
        item.words = trim( item.text );
        item.words = item.words.slice(0, 255);
        // value = trim( value );
        // console.log( value );
        // resultWords.push( value )
        // console.log( String.prototype.replace.apply( value, /[\n\r]/ ) );
    } );
    console.log( "dataHandler", data );
    data.forEach( function ( item ) {
        save_to_db(item);
    } )

}

function evaluteAfterLoad() {
    console.log( "evaluteAfterLoad" );
     if( !!window.jQuery && !!window.jQuery.each ){
         console.log( "jq1", $().jquery );
         // setTimeout( function loadMore() {
             window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
             console.log( "loadingMore", $(".W_pages .page").length, document.querySelector('body').scrollTop, $("title").html(), $( "div[action-type$=feed_list_item]" ).length );
             if ( !!$(".W_pages .page") && $(".W_pages .page").length > 0 || $( "div[action-type$=feed_list_item]" ).length > 0 && $(".W_loading").length === 0 ) {
                 console.log( $( "div[action-type$=feed_list_item]" ).length );
                 getData( $ );
             } else {
                 // setTimeout( loadMore, 500 );
                 if( $( "div[action-type$=feed_list_item]" ).length % 15 !== 0 ) {
                     console.log( $( "div[action-type$=feed_list_item]" ).length );
                     getData( $ );
                 }
             }
         // } , 500);
     }else {
         (function() {
             var script = document.createElement('script');
             script.src = 'https://cdn.staticfile.org/jquery/1.11.3/jquery.min.js';
             script.type = 'text/javascript';
             script.onload = function() {
                console.log( "jq2", $().jquery );
                // setTimeout( function loadMore() {
                    window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
                    console.log( "loadingMore", $(".W_pages .page").length, document.querySelector('body').scrollTop, $("title").html(),$( "div[action-type$=feed_list_item]" ).length );
                    if ( !!$(".W_pages .page") && $(".W_pages .page").length > 0 || $( "div[action-type$=feed_list_item]" ).length > 0 && $(".W_loading").length === 0 ) {
                        console.log( $( "div[action-type$=feed_list_item]" ).length );
                        getData( $ );

                    } else {
                        if( $( "div[action-type$=feed_list_item]" ).length % 15 !== 0 ) {
                            console.log( $( "div[action-type$=feed_list_item]" ).length );
                            getData( $ );
                        }
                        // setTimeout( loadMore, 500 );
                    }
                // } , 500);
             };
             document.getElementsByTagName('head')[0].appendChild(script);
         })();
     }
     function getData( $ ) {

         var data = [];
         // var words = [];
         var MTKey = "kNsgGmwEnCN6TPCmw4xu";
         // var $uls = $('ul[node-type$=fl_pic_list]');
         // var MTnodes = $( ".WB_text" );
         var $feedListItems = $( "div[action-type$=feed_list_item]" );
         console.log( $("title").html() );
         $.each( $feedListItems, function ( index, value ) {
             var $item = $( value ),
                 $transpondedItem = $item.find( "div[node-type$=feed_list_forwardContent]" );
             if ( $transpondedItem.length > 0 ) {
             // 如果是转发的微博，只收录被转发的那条
                 $item = $transpondedItem;
             }
             var text = "",
                 srcs = [],
                 type = 0,
                 id = "moment_" + Date.now();
             //文本
             var $textItem = $item.find( ".WB_text" );
             if ( $textItem.length > 0 ) {
                 var innerHtml = $textItem.html();
                 text = innerHtml === "" ? "" : innerHtml.replace( /<[^b][^r].*>|[\n\r]|undefined/g, "" );
             }

             //链接
             var $ulInMediaBox = $item.find( ".media_box ul" );
             if ( $ulInMediaBox.length === 0 ) {
                 //纯文本
                 type = 1;
                 data.push( {
                     text: text,
                     srcs: srcs,
                     type: type,
                     id: id
                 } );
                 return;
             }
             var $lis = $ulInMediaBox.find( "li" ),
                 numOfLis = $lis.length;
             if ( numOfLis === 0 ) {//纯文字
                 type = 1;
             } else if ( numOfLis > 1 && !$lis.hasClass( "WB_video" ) ) { //多图
                 type = 2;
                 srcs = getRealSrcsByProp( $ulInMediaBox.attr( "action-data" ), "clear_picSrc" );
             } else　{　//　lisnum === 1 => 单图或单视频
                 var actionData = $( $lis[0] ).attr( "action-data" );
                 if ( $lis.hasClass( "WB_video" ) ) { // video
                     type = 3;
                     srcs = getRealSrcsByProp( actionData, "video_src" );
                     console.log( "videoSrc: ", srcs );
                 } else if ( $lis.hasClass( "WB_pic" ) ) { // pic
                     type = 2;
                     srcs.push( $lis.find( "img" ).attr( "src" ) );
                 } else { // unexpected moment type
                     return;
                 }
             }
             data.push( {
                 text: text,
                 srcs: srcs,
                 type: type,
                 id: id
             } );
         } );
         console.log( "lengthOfData", data.length );
         console.log( "pageIsLoaded" );

         console.log( MTKey + JSON.stringify( data ) );
     }

     function getRealSrcsByProp( acDaStr, prop ) {
         var acDas = acDaStr.split( "&" ),
             reslutSrcs = [];
         $.each( acDas, function ( index ) {
             var item = acDas[ index ];
             //preview pic key is "thumb_picSrc"
             if ( ~acDas[ index ].indexOf( prop ) ) {
                 var srcs = [];
                 $.each( item.split( "=" )[1].split( "," ), function ( i, v ) {
                     srcs.push( decodeURIComponent( v ) );
                 } );
                 reslutSrcs = srcs;
                 return;
             }
         } );
         return reslutSrcs;
     }
}

module.exports  = { save_to_db, onLoadComplete, trim, dataHandler, evaluteAfterLoad };