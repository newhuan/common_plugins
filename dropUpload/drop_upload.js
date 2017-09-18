var $dropArea = document.querySelector( "#drop-area" ),
    fileSizeLimit = 20 * 1024 * 1024;
//prevent drop event default event
$dropArea.addEventListener( "dragleave", preventEventDefaultBehavior );
$dropArea.addEventListener( "drop", preventEventDefaultBehavior );
$dropArea.addEventListener( "dragenter", preventEventDefaultBehavior );
$dropArea.addEventListener( "dragover", preventEventDefaultBehavior );
//drop upload
$dropArea.addEventListener( "drop", preventEventDefaultBehavior );

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
 * drop upload event handler
 * @param { Object } evt event object
 * @returns {}
*/
function dropUploadHandler( evt ) {
    var e = evt || window.event;
    e.preventDefault(); //取消默认浏览器拖拽效果
    var fileList = e.dataTransfer.files; //获取文件对象
    //检测是否是拖拽文件到页面的操作
    if (fileList.length == 0) {
        return false;
    }

    //检测文件是不是图片
    // if (fileList[0].type.indexOf('image') === -1) {
    //     alert("您拖的不是图片！");
    //     return false;
    // }
    fileList[0].value = Date.now() + fileList[0].name;
    fileHandler( fileList[0] );
}

/**
 * check file legallity
 * @param { Object } file file object
 * @returns {}
*/
function fileHandler( file ) {
    var fileSize = file.size;
    if (fileSize == 0) {
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
    console.log(file);
}