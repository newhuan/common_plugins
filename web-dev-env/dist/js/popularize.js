/**
 * Created by newhuan on 2017/8/7.
 */

// var root = "http://api.mitures.com:23333/";
// var root = "http://10.0.0.246:8000/";
// var root = "http://10.0.0.99:8000/";
// var root = "http://106.14.12.233:8000/";
var root = "http://10.0.0.61:8000/";
// const pubKey = `  -----BEGIN PUBLIC KEY-----
// MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnMk+MvRm48SEnFlBTjllD1eQ8LR6GpHdb7X4R8OBt3oRuph/FBBSZIq6dlSKXAvG6Zfa3rBkKvMN0OcFgTXhgPYWCzh/Pz9nuEW7oGgUTA++HKUeGXgh4yru1w2QTcUIP1xWrKjPY2QS63q4clH3hS5rfpOkDEmQ53KgnTHbeqChQN3ILmoLeyvShgYMnBKhYQUbT5K4pxALSMeBK4/B2u3j7pPuH/TP7Wpjjn2ziS/sC9ii6dVLH/C5wKsLnwm9xKI1O3zLJX5uy6a84MV9G6RVlsjZ4Bfaav4zmP54g1GDaZLpDe+zprQI0iPVx2IF9BgsU/6QAZ6/0965RavcMQIDAQAB
// -----END PUBLIC KEY-----`;
var pubKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8W+9X+HqCBpL2d2baVGI80k/x\n" +
            "mVm31kNU35p3PrOSyDLCHQYD327QD9cppfLeILVH5JV+hkzGSZGfz0PgGAZq7Bov\n" +
            "2rL7DEaG36DD+uIkz8jfsJ+evpzaLQBCHwS8Yaa8b0YRFEoqAaKM9v4Ou9NzElS7\n" +
            "b7+HJ9/5hXF7mqXnbQIDAQAB";
var urls = {
    login: "login",//登录
    register: "register",//注册
    getVCode: "user/vcode/",//获取验证码
    findBackPwdCode: "102",//找回密码 SMS type code
    registCode: "101",//注册用验证码 SMS type code
    resetPwd: "user/pwd",//重置密码
    pay: "pay/alipay/way/wap",//会员费用支付
    getAvatar: "user/avatar",//获取头像图片
    downLoad: "resource/app"//下载
};
let token;//self token
let codeState = true;
// let registerFlag = true;
let referrer = "";
let user = "";  //self
let link = "https://api.mitures.com/register/register.html?";
// let link = "http://api.mitures.com:23333/register/register.html?";
// let link = "http://10.0.0.246/register/register.html?";
let downloadURL = "";
/*********** utilities **************/
function getUrlParam(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    let r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r !== null) return unescape(r[2]); return null; //返回参数值
}

function checkJSON(msg) {
    if(!msg){
        return false;
    }
    var data,
        flag = true;
    if(typeof msg === "string"){
        try {
            data = JSON.parse(msg);
        }catch(e) {
            flag = false;
        }
    }else {
        data = msg;
    }
    if(!flag){
        return false;
    }
    return data;
}

function isWeixinBrowser(){
    return /micromessenger/.test(navigator.userAgent.toLowerCase())
}

function GetRequest() {
    let url = location.search; //获取url中"?"符后的字串
    let theRequest = new Object();
    var strs;
    if (url.indexOf("?") != -1) {
        let str = url.substr(1);
        strs = str.split("&");
        for(let i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

function hideAllTips() {
    $('.tip').hide();
}

function skipPay(tip) {
    let bool = confirm("恭喜您，" + tip + "立即成为秘图会员请点击确定，立即下载秘图app请点击取消！");
    return !bool;
}

function hideAll() {
    $('.form-container').hide();
    $('.choose-pay').hide();
    $('.vip-message').hide();
}

function downloadApp() {
//     let $anchor = $('#download-a')[0];
//     $anchor.href = downloadURL;
//     $anchor.click();
    // window.location.href = "https://api.mitures.com/phonefile/downloadApp";
    // window.location.href = "https://api.mitures.com/" + urls.downLoad;
    window.location.href = root + urls.downLoad;
    // window.location.href = "https://10.0.0.246/phonefile/downloadApp";
}

function t1() {
    hideAll();
    showForm();
}

function t2() {
    hideAll();
    showChoose();
}

function t3() {
    hideAll();
    showVip();
}

function showChoose() {
    $('.choose-pay').show();
    $('body').css({
        "backgroundColor":"#F6F6F6"
    })
}

function showVip() {
    $('.vip-message').show();
}

function showForm() {
    $('.form-container').show();
    $('.register-btn').click();
    $('body').css({
        "backgroundColor":"white"
    })
}

function checkPhone(phone) {
    let regTel = new RegExp('^1\\d{10}$');
    return regTel.test(phone);
}

function checkTel() {
    let phone = $('#tel-reg').val();
    if(checkPhone(phone)){
        $('.tip-tel').hide();
    }else{
        $('.tip-tel').show();
    }
}

function checkPassword(password) {
    let regPwd = new RegExp('^[!"#$%&\'\(\)*+,-./0-9:;<=>?@A-Z[\\]^_`a-z{|}~]{8,16}$');
    let regPwd2 = new RegExp('^[0-9]{8,16}$');
    if(!regPwd.test(password)){
        return false;
    }else{
        return !regPwd2.test(password);
    }
}

function checkCode(code) {
    let regCode = new RegExp('^[0-9]{6,6}$');
    return regCode.test(code);
}

function checkPwd() {
    let pwd = $('#pwd-reg').val();
    if(!checkPassword(pwd)){
        $('.tip-pwd').show();
    }else{
        $('.tip-pwd').hide();
    }
}

function checkRepwd() {
    let pwd = $('#pwd-reg').val();
    let rePwd = $('#repwd-reg').val();
    if(!checkPassword(rePwd)){
        $('.tip-repwd-format').show();
        return;
    }else{
        $('.tip-repwd-format').hide();
    }
    if(rePwd !== pwd){
        $('.tip-repwd').show();
    }else{
        $('.tip-repwd').hide();
    }
}

function getHeading(id) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "get",
            url: root + urls.getAvatar + "/" + id,
            data: {

            },
            success: function (res) {
                resolve(res);
            },
            error: function (e) {
                reject(e);
            }
        })
    })
}

function bgAnimate() {
    let $body = $('body');
    $body.css('backgroundPosition', '0 0');

    let bgscroll = function () {
        let current = parseInt($body.css('backgroundPosition').split(' ')[0]),
            newBgPos = (current - 1) + 'px 0px';
        $body.css('backgroundPosition', newBgPos);
    };

    setInterval(bgscroll, 75);
}

function showAlert(tip) {
    if(!!tip){
        $('#alert-message').html("恭喜您" + tip + "成功，您现在可以");
    }else{
        $('#alert-message').html("您可以选择");
    }
    $('.alert').show();
}

function hideAlert() {
    $('.alert').hide();
}

function showArrows() {
    $('.arrows').show();
}

function hideArrows() {
    $('.arrows').hide();
}

function setDefaultAvatar() {
    $('#heading').attr("src", "./assests/images/logo@3x.png");
    $('#referrer').html("");
    $('.referrer').hide();
}
/*********** utilities end **********/
/*********** ready ********************/

$('window').ready(function () {
   // bgAnimate();
    referrer = getUrlParam("id");
    let req = GetRequest();
    referrer = req["id"];
    if(!referrer){
    //without referrer
        setDefaultAvatar();
    }
    if(referrer){
        // $('#referrer').html();
        getHeading(referrer).then(function (res) {
            var data = checkJSON(res);
            if(!!data && !!data.msgId && data.msgId === "0200"){
                $('#heading').attr("src", data.avatar);
                $('#referrer').html(referrer);
                $('.referrer').show();
            }else {
                setDefaultAvatar();
            }
        }).catch(function (e) {
            if (typeof DEBUG !== "undefined") {
                console.log("getAvatarError", e);
            }
            setDefaultAvatar();
        })
    }else {
        setDefaultAvatar();
    }

    let state = getUrlParam("state");
    if(state === "payed"){
        window.user = getUrlParam("user");
//         var browser={
//             versions:function(){
//                 var u = navigator.userAgent, app = navigator.appVersion;
//                 return {
//                     trident: u.indexOf('Trident') > -1, //IE内核
//                     presto: u.indexOf('Presto') > -1, //opera内核
//                     webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
//                     gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
//                     mobile: !!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/), //是否为移动终端
//                     ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
//                     android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
//                     iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
//                     iPad: u.indexOf('iPad') > -1, //是否iPad
//                     webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
//                 };
//             }()
//         }
//         var iOS_URL = "https://itunes.apple.com/us/app/id1230368570?l=zh&ls=1&mt=8";
//         var Android_URL = "http://mituresprd.oss-cn-hangzhou.aliyuncs.com/0506046b5f873976cefd5e077e5acb71/app-release.apk";
//         if(browser.versions.iPhone){
//             // document.getElementById("vlink").setAttribute("href",iOS_URL);
// //            document.getElementById("vlink").click();
//             downloadURL = iOS_URL;
//         }
//         //Android
//         else if(browser.versions.android){
//             // document.getElementById("vlink").setAttribute("href",Android_URL);
//             downloadURL = Android_URL;
// //            document.getElementById("vlink").click();
//         }else{
//             downloadURL = Android_URL;
//         }
        t3();
    }else{
        t1();
    }
    // if(isWeixinBrowser()){
    //     alert("请点击右上角，在菜单中选择在浏览器中打开！");
    // }

//     $('.form-container').on('click', function () {
//     // $('input').blur();
//     // $('.tip').hide();
//     $('.ipt-item').removeClass('focus1');
// });
});

/*******************************/

/*********** form control *******************/
// let $registerBtn = $('.register-btn');
let $signs = $('.sign');
let $models = $('.model');
$signs.on('click', function () {
    if(!$(this).hasClass('active')){
        $('input').blur();
        $('.tip').hide();
        $('.ipt-item').removeClass('focus1');
        $signs.toggleClass('active');
        $models.toggle();
        if($(this).hasClass('register-btn')){
            $('.form-title').css({
                "background-image":"url('./assests/images/sign up_bg@3x.png')"
            });
        }else{
            $('.form-title').css({
                "background-image":"url('./assests/images/sign in_bg@3x.png')"
            });
        }
    }else {

    }
});

let $input = $('input');
$input.on('focus', function (e) {
   $input.parent().removeClass('focus1');
   $(this).parent().addClass('focus1');
   // e.stopPropagation();
   // return false;
});


let $payItems = $('.pay-item');
$payItems.on('click', function () {
    //必须选中一个
    if(!$(this).find('.check-circle').hasClass('em-checked')){
        $payItems.find('.check-circle').removeClass('em-checked');
        $(this).find('.check-circle').addClass('em-checked');
    }
});
/*********** form control end *******************/

/*********** get code ****************/
let $getCode = $('#get-code');
$getCode.on('click', function () {
    let phone = $('#tel-reg').val();

    if(!checkPhone(phone)){
        $('.tip-tel').show();
        return;
    }else{
        $('.tip-tel').hide();
    }
    animateGetCode();
   getCode(phone).then(function (res) {
       // console.log(res);
       res = JSON.parse(res);

       if(res.state === "success"){
           $('.tip-getCode').hide();
       }else if(res.state === "error"){
           $('.tip-getCode').show();
       }else if(res.state === "fail"){
           $('.tip-getCode').show();
       }
   }).catch(function (e) {
       console.log("error", e);
   })
});

function getCode(phone) {//获取验证码
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: 'get',
            url: root + urls.getVCode + urls.registCode + "/" + phone,
            data: {
            },
            success: function (res) {
                resolve(res);
            },
            error: function (e) {
                reject(e);
            }
        })
    })
}

function animateGetCode() {
    if(!codeState){
        return;
    }
    let $getCode = $('#get-code');
    disableGetCode();
    $getCode.html("60s");
    let time = 59;
    let id = setInterval(function () {
        if(time >= 0){
            $getCode.html(time + "s");
            time -= 1;
        }else {
            clearInterval(id);
            recoverGetCode();
        }
    }, 1000);
}

function disableGetCode() {
    $('#get-code').css({
        "color": "#ddd"
    });
    codeState = false;
}

function recoverGetCode() {
    let $getCode = $('#get-code');
    $getCode.html("获取验证码").css({
        "color": "#A5B0FF"
    });
    codeState = true;
    // $('#get-code')
}
/*********** get code end ******************/

/***********  register ***********/
let $telReg = $('#tel-reg');
$telReg.on('blur', function () {
   checkTel();
});

let $pwdReg = $('#pwd-reg');
$pwdReg.on('blur', function () {
   checkPwd();
});

let $repwdReg = $('#repwd-reg');
$repwdReg.on('blur', function () {
   checkRepwd();
});

let $codeReg = $('#code-reg');
$codeReg.on('blur', function () {
   if($(this).val() === ""){
       $('.tip-code-empty').show();
       return;
   } else{
       $('.tip-code-empty').hide();
       if(!checkCode($(this).val())){
           $('.tip-code-format').show();
       }else{
           $('.tip-code-format').hide();
       }
   }

});

let $register = $('#submit-reg');
$register.on('click', function () {
    $('.register input').blur();

    let tel = $('#tel-reg').val();
    let code = $('#code-reg').val();
    let pwd = $('#pwd-reg').val(),
        rePwd = $('#repwd-reg').val();
    // let phone = $('#tel-reg').val();
    let flag = true;
    if(checkPhone(tel)){
        $('.tip-tel').hide();
    }else{
        $('.tip-tel').show();
        // return;
        flag = false;
    }

    if(!checkPassword(pwd)){
        $('.tip-pwd').show();
        flag = false;
    }else{
        $('.tip-pwd').hide();
    }

    if(code === ""){
        flag = false;
        $('.tip-code-empty').show();
    }else{
        $('.tip-code-empty').hide();
        if(!checkCode(code)){
            flag = false;
            $('.tip-code-format').show();
        }else{
            $('.tip-code-format').hide();
        }
    }

    if(!checkPassword(rePwd)){
        $('.tip-repwd-format').show();
        flag = false;
    }else{
        $('.tip-repwd-format').hide();
    }

    if(rePwd !== pwd){
        $('.tip-repwd').show();
        flag = false;
    }else{
        $('.tip-repwd').hide();
    }

    if(!flag){
        return;
    }

    register(tel, code, pwd).then(function (res) {
        var data = checkJSON(res);
        if(!data){
            alert("服务器正忙，请稍候再试！");
            hideAllTips();
        }
        if(!!data.msgId){
            hideAllTips();
            if(data.msgId === "0200"){
                window.token = data.token;
                window.user = !!data.user ? data.user.uid : "0";
                $('.tip-code').hide();
                $('.tip-tel-hasExist').hide();
                showAlert("注册");
                //登录 获取token和id
                window.mt_phone = tel;
                window.mt_pwd = pwd;
                // var encrypt = new JSEncrypt();
                // encrypt.setPublicKey(pubKey);
                // pwd = encrypt.encrypt(pwd);
                /************************/
                /*  login to get token  */
                /************************/
                login(tel, pwd).then(function (res) {
                   var data = checkJSON(res);
                    if(!data){
                        alert("服务器正忙，请稍候再试！");
                    }
                    if(!!data.msgId){
                        if(data.msgId === "0200"){
                            window.token = data.token;
                            window.user = data.user.uid;
                        }else if(data.msgId === "1404"){
                            alert("服务器正忙，请稍候再试！");
                        }else if(data.msgId === "0400"){
                            alert("服务器正忙，请稍候再试！");
                        }else {
                            alert("服务器正忙，请稍候再试！");
                        }
                    }else {
                        alert('服务器正忙，请稍候再试！');
                    }
               }).catch(function (e) {
                   alert('服务器正忙，请稍候再试！');
               });
            }else if(data.msgId === "1414"){//该手机已注册
                $('.tip-tel-hasExist').show();
            }else if(data.msgId === "1405"){//验证码错误
                $('.tip-code').show();
            }else if(data.msgId === "0500" || data.msgId === "0400" ){//服务器错误 || 失败
                hideAllTips();
                alert('服务器正忙，请稍候再试！');
            }else if(data.msgId === "0400"){//参数错误
                hideAllTips();
                alert('参数错误!');
            }else {
                alert("服务器正忙，请稍候再试！");
            }
        }else {
            hideAllTips();
            alert('服务器正忙，请稍候再试！');
        }

    }).catch(function (e) {
        console.log("error", e);
    })
});

function register(phone, vcode, password) {
    let encrypt = new JSEncrypt();
    encrypt.setPublicKey(pubKey);
    password = encrypt.encrypt(password);
    let expandId = getUrlParam('id');
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "post",
            url: root + urls.register,
            data: {
                phone, vcode, password, expandId
            },
            success: function (res) {
                resolve(res);
            },
            error: function (e) {
                reject(e);
            }
        })
    })
}
/************  regitser end ***********/

/************ login **********************/
let $telLog = $('#tel-log');
$telLog.on('blur', function () {
    // console.log($(this).val());
   if(!checkPhone($(this).val())){
       $('.tip-tel-log').show();
   } else{
       $('.tip-tel-log').hide();
   }
});

let $pwdLog = $('#pwd-log');
$pwdLog.on('blur', function () {
   if(!checkPassword($(this).val())){
       $('.tip-pwd-log-format').show();
   } else{
       $('.tip-pwd-log-format').hide();
   }
});

let $login = $('#submit-log');
$login.on('click', function () {
    let id = $('#tel-log').val(),
        pwd = $('#pwd-log').val();
    let flag = true;
    if(!checkPhone(id)){
        $('.tip-tel-log').show();
        flag = false;
    } else{
        $('.tip-tel-log').hide();
    }

    if(!checkPassword(pwd)){
        $('.tip-pwd-log-format').show();
        flag = false;
    } else{
        $('.tip-pwd-log-format').hide();
    }

    if(!flag){
        return;
    }

   login(id, pwd).then(function (res) {
       // console.log(res);
       var data = checkJSON(res);
        if(!data){
            alert("服务器正忙，请稍候再试！");
            hideAllTips();
        }
        if(!!data.msgId){
            hideAllTips();
            if(data.msgId === "0200"){
                window.token = data.token;
                window.user = data.user.uid;
                if(data.user.lv > 0){
                    window.user = data.user.uid;
                    // recover after test
                    // showAlert("注册");//for testing
                    t3();
                }else{
                    hideAllTips();
                    showAlert("登录");
                }
            }else if(data.msgId === "1406"){
                $('.tip-pwd-log-check').show();
            }else if(data.msgId === "1404"){
                $('.tip-pwd-log-check').show();
            }else if(data.msgId === "0400"){
                hideAllTips();
                alert("参数错误");
            }else {
                hideAllTips();
                alert("服务器正忙，请稍候再试！");
            }
        }else {
            hideAllTips();
            alert('服务器正忙，请稍候再试！');
        }
   }).catch(function (e) {
       if (typeof DEBUG !== "undefined") {
           console.log("login error", e);
       }
       hideAllTips();
       alert('服务器正忙，请稍候再试！');
   });
});

function login(phone, password) {
    let encrypt = new JSEncrypt();
    encrypt.setPublicKey(pubKey);
    password = encrypt.encrypt(password);

    return new Promise(function (resolve, reject) {
        $.ajax({
            type: 'post',
            url: root + urls.login,
            data: {
                phone, password
            },
            success: function (res) {
                resolve(res);
            },
            error: function (e) {
                reject(e);
            }
        })
    })
}
/************ login end ******************/

/************ pay **************/
let $paySubmit = $('#pay-submit');
$paySubmit.on('click', function () {
    if(!window.token){
        alert("请先注册或登录！");
        return;
    }
    if(!!window.isPayClicked){
        return;
    }
    window.isPayClicked = true;
    // let clickTime  = new Date().getTime();
    // if((clickTime - payTime) / 1000 < 1){
    //     return;
    // }
    // window.location.href = root + urls.pay + '/' + window.token;
    let way = $('.pay-ipt:checked').val();
    pay(way).then(function (res) {
        // console.log(res);
        // $('body').append(res);
        var data = checkJSON(res);
        if (!data) {
            alert("服务器正忙，请稍候再试！");
            return;
        }
        if (!!data.msgId) {
            if (data.msgId === "0200") {//成功
                window.location.href = data.alipay_param;
            } else {
                alert("服务器正忙，请稍候再试！");
            }
        } else {
            alert("服务器正忙，请稍候再试！");
        }
    }).catch(function (e) {
         console.log("error", e);
    })
});

function pay(way) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "get",
            url: root + urls.pay,
            data: {
                way
            },
            beforeSend: function (request) {
                request.setRequestHeader("token", window.token);
            },
            success: function (res) {
                window.isPayClicked = false;
                resolve(res);
            },
            error: function (e) {
                window.isPayClicked = false;
                reject(e);
            }
        })
    })
}
/************ pay end **********/

/************ vip *************/
let $generateRrcode = $('#generate-qrcode');
$generateRrcode.on('click', function () {
    let $qrcodeContainer = $('.qrcode-container');
    $('#qrcode').qrcode({width: $qrcodeContainer.width(),height: $qrcodeContainer.height(),text: link + "id=" + window.user});
    $qrcodeContainer.show();
});

let $download = $('#download');
$download.on('click', function () {
    // console.log(downloadURL);
    // window.location.href = downloadURL;
    downloadApp();
    // window.location.href = "https://api.mitures.com/phonefile/downloadApp";
});

let $closeQRcode = $('.close');
$closeQRcode.on('click', function () {
    $('.qrcode-container').hide();
    $('#qrcode canvas').remove();
});


/************ vip end*************/
/************ alert *************/
let $becomeVipBtn = $('#become-vip');
$becomeVipBtn.on('click', function () {

    if(!isWeixinBrowser()){
        t2();
    }else{
        // alert('因微信内置浏览器不支持支付宝支付，请点击右上角，在菜单中选择"在浏览器中打开",登录并支付，您也可以选择在秘图App中完成支付。给您带来不便非常抱歉。');
        showArrows();
    }
    hideAlert();
});

let $arrows = $('.arrows');
$arrows.on('click', function () {
   hideArrows();
   showAlert(0);
});

let $downloadAppBtn = $('#download-app');
$downloadAppBtn.on('click', function () {
    hideAlert();
    downloadApp();
    // window.location.href = "https://api.mitures.com/phonefile/downloadApp";
    // t3();
});
/************ alert end*************/
