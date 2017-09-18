var $pasteArea = document.querySelector( "#paste-area" ),
    pasteAreaId = "paste-area",
    fileSizeLimit = 20 * 1024 * 1024;
//paste upload
document.addEventListener( "paste", preventEventDefaultBehavior );
document.addEventListener( "paste", pasteUploadHandler );

/**
 * prevent event default behavior
 * @param { Object } evt event object
 * @returns {}
*/
function preventEventDefaultBehavior( evt ) {
    var e = evt || window.event;
    e.preventDefault();
}

/**
 * paste upload event handler
 * @param { Object } evt event object
 * @returns {}
*/
function pasteUploadHandler( evt ) {
    if ( !document.activeElement ) {
        alert( "您的浏览器不支持粘贴上传，为了更好地体验XXX，建议您使用IE10、Chrome、FireFox、Safari、360等主流浏览器。" );
    }
    if ( document.activeElement.id !== pasteAreaId ) {
        //输入面板未获得焦点
        return;
    }
    var e = evt || window.event,
        cbd = e.clipboardData;
    var ua = window.navigator.userAgent;

    // 如果是 Safari 直接 return
    if ( !( e.clipboardData && e.clipboardData.items ) ) {
        return;
    }

    // Mac平台下Chrome49版本以下 复制Finder中的文件的Bug Hack掉
    if( cbd.items && cbd.items.length === 2 && cbd.items[ 0 ].kind === "string" && cbd.items[ 1 ].kind === "file" &&
        cbd.types && cbd.types.length === 2 && cbd.types[ 0 ] === "text/plain" && cbd.types[ 1 ] === "Files" &&
        ua.match( /Macintosh/i ) && Number( ua.match( /Chrome\/(\d{2})/i )[ 1 ] ) < 49 ) {
        return;
    }

    for( var i = 0; i < cbd.items.length; i++ ) {
        var item = cbd.items[ i ];
        if ( item.kind == "file" ) {
            var blob = item.getAsFile();
            blob.value = Date.now() + blob.name;
            fileHandler( blob );
            // blob 就是从剪切板获得的文件 可以进行上传或其他操作
        }
    }
}

/**
 * check file legallity
 * @param { Object } file file object
 * @returns {}
*/
function fileHandler( file ) {
    var fileSize = file.size;
    if ( fileSize == 0 ) {
        //空文件
        return
    } else if ( fileSize > fileSizeLimit ) {
        //文件体积大于20M
        return;
    }
    uploadFile( file );
}

/**
 * upload file to sever side
 * @param { Object } file file object
 * @returns {}
*/
function uploadFile( file ) {
    console.log( file );
}
