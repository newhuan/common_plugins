let util = {

};

util.getUrlParam = function ( name ) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    let r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r !== null) return unescape(r[2]); return null; //返回参数值
}

util.checkJSON = function( msg ) {
    if( !msg ) {
        return false;
    }
    var data,
        flag = true;
    if ( typeof msg === "string" ) {
        try {
            data = JSON.parse( msg );
        } catch ( e ) {
            flag = false;
        }
    } else {
        data = msg;
    }
    if ( !flag ) {
        return false;
    }
    return data;
}

util.checkPasswordFormat = function ( password ) {
    let regPwd = new RegExp( '^[!"#$%&\'\(\)*+,-./0-9:;<=>?@A-Z[\\]^_`a-z{|}~]{8,16}$' );
    let regPwd2 = new RegExp( '^[0-9]{8,16}$' );
    if( !regPwd.test( password ) ){
        return false;
    } else {
        return !regPwd2.test(password);
    }
}

util.checkPhone = function ( phone ) {
    let phoneReg = /^1\d{10}$/;
    return phoneReg.test( this.clearPhone( phone ) );
}

util.clearPhone = function ( phone ) {
    let spliterReg = new RegExp( "[\\\/\\s-]", "gi" );
    return phone.split( spliterReg ).join( "" );
}

util.isMobile = function () {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

util.checkWebp = function() {
    var hasWebP = (function(feature) {
        var images = {
            basic: "data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoCAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA==",
            lossless: "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAQAAAAfQ//73v/+BiOh/AAA="
        };

        return new Promise( ( resolve, reject ) => {
            $( "<img>" ).on( "load", function() {
                if ( this.width === 2 && this.height === 1 ) {
                    resolve();
                } else {
                    reject();
                }
            }).on("error", function() {
                reject();
            }).attr("src", images[feature || "basic"]);
        } );
    })();
    return hasWebP;
    // try {
    //     let result = await hasWebP;
    //     window.supportWebp = true;
    // } catch ( e ) {
    //     window.supportWebp = false;
    // }
}


module.exports = util;