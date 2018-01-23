/**
 * Created by xox on 2017/7/13.
 */
/*************** type  *********************/
function isNull(parm) {
    return !parm && typeof parm === 'object';
}

function isUndefined(parm) {
    return typeof parm === 'undefined';
}

//reverse a string
function reverseString(string) {
    if (typeof string !== 'string') {
        return false
    }

    // Step 1: deal with combining marks and astral symbols (surrogate pairs)
    string = string
    // Swap symbols with their combining marks so the combining marks go first
        .replace(/(<%= allExceptCombiningMarks %>)(<%= combiningMarks %>+)/g, function ($0, $1, $2) {
            // Reverse the combining marks so they will end up in the same order
            // later on (after another round of reversing)
            return reverseString($2) + $1;
        })
        // Swap high and low surrogates so the low surrogates go first
        .replace(/([\uD800-\uDBFF])([\uDC00-\uDFFF])/g, '$2$1');
    // Step 2: reverse the code units in the string
    var result = '';
    var index = string.length;
    while (index--) {
        result += string.charAt(index);
    }
    return result;
}

/************************************/
/************************************/
/************************************/
/************************************/
/************************************/
/************************************/
/************************************/
/************************************/
/************************************/
/************************************/
/**************** search url param********************/

/************************************/
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r !== null) return unescape(r[2]);
    return null; //返回参数值
}

function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    var strs;
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

function getUrlParam2(name) {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    var strs;
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest[name];
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return (r[2]);
    return null;
}

/************************************/
/****************cookie********************/
/************************************/

//写cookies
function setCookie(name, value) {
    var days = 1;
    var exp = new Date();
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

//读取cookies
function readCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    } else {
        return null;
    }

}

//删除cookies
function delCookie(name) {
    var cval = readCookie(name);
    if (cval != null) {
        document.cookie = name + "=" + cval + ";expires=" + (new Date(0)).toGMTString();
    }
}

/************************************/

/* 格式化日期 */
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,  // 月份
        "d+": this.getDate(),		// 日
        "h+": this.getHours(),		// 小时
        "m+": this.getMinutes(),	// 分
        "s+": this.getSeconds(),	// 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


//数组功能扩展
Array.prototype.each = function (fn) {
    fn = fn || Function.K;
    var a = [];
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < this.length; i++) {
        var res = fn.apply(this, [this[i], i].concat(args));
        if (res != null) a.push(res);
    }
    return a;
};

//数组是否包含指定元素
Array.prototype.contains = function (suArr) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === suArr) {
            return true;
        }
    }
    return false;
};
//不重复元素构成的数组
Array.prototype.uniquelize = function () {
    var ra = new Array();
    for (var i = 0; i < this.length; i++) {
        if (!ra.contains(this[i])) {
            ra.push(this[i]);
        }
    }
    return ra;
};
//两个数组的补集
Array.complement = function (a, b) {
    return Array.minus(Array.union(a, b), Array.intersect(a, b));
};
//两个数组的交集
Array.intersect = function (a, b) {
    return a.uniquelize().each(function (o) {
        return b.contains(o) ? o : null
    });
};
//两个数组的差集
Array.minus = function (a, b) {
    return a.uniquelize().each(function (o) {
        return b.contains(o) ? null : o
    });
};
//两个数组并集
Array.union = function (a, b) {
    return a.concat(b).uniquelize();
};
/**
 * 时间戳转化为日期（用于消息列表）
 * @return {string} 转化后的日期
 */
var transTime = (function () {
    var getDayPoint = function (time) {
        time.setMinutes(0);
        time.setSeconds(0);
        time.setMilliseconds(0);
        time.setHours(0);
        var today = time.getTime();
        time.setMonth(1);
        time.setDate(1);
        var yearDay = time.getTime();
        return [today, yearDay];
    }
    return function (time) {
        var check = getDayPoint(new Date());
        if (time >= check[0]) {
            return dateFormat(time, "HH:mm")
        } else if (time < check[0] && time >= check[1]) {
            return dateFormat(time, "MM-dd HH:mm")
        } else {
            return dateFormat(time, "yyyy-MM-dd HH:mm")
        }
    }
})();
/**
 * 时间戳转化为日期(用于左边会话面板)
 * @return {string} 转化后的日期
 */
var transTime2 = (function () {
    var getDayPoint = function (time) {
        time.setMinutes(0);
        time.setSeconds(0);
        time.setMilliseconds(0);
        time.setHours(0);
        var today = time.getTime();
        time.setMonth(1);
        time.setDate(1);
        var yearDay = time.getTime();
        return [today, yearDay];
    }
    return function (time) {
        var check = getDayPoint(new Date());
        if (time >= check[0]) {
            return dateFormat(time, "HH:mm")
        } else if (time >= check[0] - 60 * 1000 * 60 * 24) {
            return "昨天";
        } else if (time >= (check[0] - 2 * 60 * 1000 * 60 * 24)) {
            return "前天";
        } else if (time >= (check[0] - 7 * 60 * 1000 * 60 * 24)) {
            return "星期" + dateFormat(time, "w");
        } else if (time >= check[1]) {
            return dateFormat(time, "MM-dd")
        } else {
            return dateFormat(time, "yyyy-MM-dd")
        }
    }
})();
/**
 * 日期格式化
 * @return string
 */
var dateFormat = (function () {
    var _map = {i: !0, r: /\byyyy|yy|MM|cM|eM|M|dd|d|HH|H|mm|ms|ss|m|s|w|ct|et\b/g},
        _12cc = ['上午', '下午'],
        _12ec = ['A.M.', 'P.M.'],
        _week = ['日', '一', '二', '三', '四', '五', '六'],
        _cmon = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
        _emon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    var _fmtnmb = function (_number) {
        _number = parseInt(_number) || 0;
        return (_number < 10 ? '0' : '') + _number;
    };
    var _fmtclc = function (_hour) {
        return _hour < 12 ? 0 : 1;
    };
    return function (_time, _format, _12time) {
        if (!_time || !_format)
            return '';
        _time = new Date(_time);
        _map.yyyy = _time.getFullYear();
        _map.yy = ('' + _map.yyyy).substr(2);
        _map.M = _time.getMonth() + 1;
        _map.MM = _fmtnmb(_map.M);
        _map.eM = _emon[_map.M - 1];
        _map.cM = _cmon[_map.M - 1];
        _map.d = _time.getDate();
        _map.dd = _fmtnmb(_map.d);
        _map.H = _time.getHours();
        _map.HH = _fmtnmb(_map.H);
        _map.m = _time.getMinutes();
        _map.mm = _fmtnmb(_map.m);
        _map.s = _time.getSeconds();
        _map.ss = _fmtnmb(_map.s);
        _map.ms = _time.getMilliseconds();
        _map.w = _week[_time.getDay()];
        var _cc = _fmtclc(_map.H);
        _map.ct = _12cc[_cc];
        _map.et = _12ec[_cc];
        if (!!_12time) {
            _map.H = _map.H % 12;
        }
        return _$encode(_map, _format);
    };
})();

//regexp

//	验证QQ号、手机号、Email、中文、邮编、身份证、IP地址
var myRegExp = {
    isPwd: function (str, low, hig) {
        var regPwd = new RegExp('^[!"#$%&\'\(\)*+,-./0-9:;<=>?@A-Z[\\]^_`a-z{|}~]{' + low + ',' + hig + '}$');
        if (this.isNumber(str)) {
            return false;
        } else {
            return regPwd.test(str);
        }
    },
    // 检查字符串是否为合法QQ号码
    isQQ: function (str) {
        // 1 首位不能是0  ^[1-9]
        // 2 必须是 [5, 11] 位的数字  \d{4, 9}
        var reg = /^[1-9][0-9]{4,9}$/gim;
        return reg.test(str);
        // if (reg.test(str)) {
        //     console.log('QQ号码格式输入正确');
        //     return true;
        // } else {
        //     console.log('请输入正确格式的QQ号码');
        //     return false;
        // }
    },
    // 检查字符串是否为合法手机号码
    isPhone: function (str) {
        var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[579]|17[0135678])[0-9]{8}$/;
        return reg.test(str);
        // if (reg.test(str)) {
        //     console.log('手机号码格式输入正确');
        //     return true;
        // } else {
        //     console.log('请输入正确格式的手机号码');
        //     return false;
        // }
    },
    // 检查字符串是否为合法Email地址
    isEmail: function (str) {
        var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        // var reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        return reg.test(str);
        // if (reg.test(str)) {
        //     console.log('Email格式输入正确');
        //     return true;
        // } else {
        //     console.log('请输入正确格式的Email');
        //     return false;
        // }
    },
    // 检查字符串是否是数字
    isNumber: function (str) {
        var reg = /^\d+$/;
        return reg.test(str);
    },
    // 去掉前后空格
    trim: function (str) {
        var reg = /^\s+|\s+$/g;
        return str.replace(reg, '');
    },
    // 检查字符串是否存在中文
    isChinese: function (str) {
        var reg = /[\u4e00-\u9fa5]/gm;
        return reg.test(str);
        // if (reg.test(str)) {
        //     console.log(str + ' 中存在中文');
        //     return true;
        // } else {
        //     console.log(str + ' 中不存在中文');
        //     return false;
        // }
    },
    // 检查字符串是否为合法邮政编码
    isPostcode: function (str) {
        // 起始数字不能为0，然后是5个数字  [1-9]\d{5}
        var reg = /^[1-9]\d{5}$/g;
        return reg.test(str);
        // var reg = /^[1-9]\d{5}(?!\d)$/;
        // if (reg.test(str)) {
        //     console.log(str + ' 是合法的邮编格式');
        //     return true;
        // } else {
        //     console.log(str + ' 是不合法的邮编格式');
        //     return false;
        // }
    },
    // 检查字符串是否为合法身份证号码
    isIDcard: function (str) {
        var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
        return reg.test(str);
        // if (reg.test(str)) {
        //     console.log(str + ' 是合法的身份证号码');
        //     return true;
        // } else {
        //     console.log(str + ' 是不合法的身份证号码');
        //     return false;
        // }
    },
    // 检查字符串是否为合法URL
    isURL: function (str) {
        var reg = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;
        return reg.test(str);
        // if (reg.test(str)) {
        //     console.log(str + ' 是合法的URL');
        //     return true;
        // } else {
        //     console.log(str + ' 是不合法的URL');
        //     return false;
        // }
    },
    // 检查字符串是否为合法日期格式 yyyy-mm-dd
    isDate: function (str) {
        var reg = /^[1-2][0-9][0-9][0-9][-/\s][0-1]{0,1}[0-9][-/\s][0-3]{0,1}[0-9]$/;
        return reg.test(str);
        // if (reg.test(str)) {
        //     console.log(str + ' 是合法的日期格式');
        //     return true;
        // } else {
        //     console.log(str + ' 是不合法的日期格式，yyyy-mm-dd');
        //     return false;
        // }
    },
    // 检查字符串是否为合法IP地址
    isIP: function (str) {
        // 1.1.1.1  四段  [0 , 255]
        // 第一段不能为0
        // 每个段不能以0开头
        //
        // 本机IP: 58.50.120.18 湖北省荆州市 电信
        var reg = /^([1-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\.([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){3}$/gi;
        return reg.test(str);
        // if (reg.test(str)) {
        //     console.log(str + ' 是合法的IP地址');
        //     return true;
        // } else {
        //     console.log(str + ' 是不合法的IP地址');
        //     return false;
        // }
    }
}
// 测试
// console.log(myRegExp.isQQ('80583600'));
// console.log(myRegExp.isPhone('17607160722'));
// console.log(myRegExp.isEmail('80583600@qq.com'));
// console.log(myRegExp.isNumber('100a'));
// console.log(myRegExp.trim('  100  '));
// console.log(myRegExp.isChinese('baixiaoming'));
// console.log(myRegExp.isChinese('小明'));
// console.log(myRegExp.isPostcode('412345'));
// console.log(myRegExp.isIDcard('42091119940927001X'));
// console.log(myRegExp.isURL('https://www.baidu.com/'));
// console.log(myRegExp.isDate('2017-4-4'));
// console.log(myRegExp.isIP('1.0.0.0'));

//	数字校验
//    数字：^[0-9]*$
//    n位的数字：^\d{n}$
//    至少n位的数字：^\d{n,}$
//    m-n位的数字：^\d{m,n}$
//    零和非零开头的数字：^(0|[1-9][0-9]*)$
//    非零开头的最多带两位小数的数字：^([1-9][0-9]*)+(.[0-9]{1,2})?$
//	  带1-2位小数的正数或负数：^(\-)?\d+(\.\d{1,2})?$
//	  正数、负数、和小数：^(\-|\+)?\d+(\.\d+)?$
//	  有两位小数的正实数：^[0-9]+(.[0-9]{2})?$
//	  有1~3位小数的正实数：^[0-9]+(.[0-9]{1,3})?$
//	  非零的正整数：^[1-9]\d*$ 或 ^([1-9][0-9]*){1,3}$ 或 ^\+?[1-9][0-9]*$
//	  非零的负整数：^\-[1-9][]0-9"*$ 或 ^-[1-9]\d*$
//    非负整数：^\d+$ 或 ^[1-9]\d*|0$
//    非正整数：^-[1-9]\d*|0$ 或 ^((-\d+)|(0+))$
//    非负浮点数：^\d+(\.\d+)?$ 或 ^[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0$
//    非正浮点数：^((-\d+(\.\d+)?)|(0+(\.0+)?))$ 或 ^(-([1-9]\d*\.\d*|0\.\d*[1-9]\d*))|0?\.0+|0$
//    正浮点数：^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$ 或 ^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$
//    负浮点数：^-([1-9]\d*\.\d*|0\.\d*[1-9]\d*)$ 或 ^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$
//    浮点数：^(-?\d+)(\.\d+)?$ 或 ^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$


//	字符校验
//    汉字：^[\u4e00-\u9fa5]{0,}$
//    英文和数字：^[A-Za-z0-9]+$ 或 ^[A-Za-z0-9]{4,40}$
//    长度为3-20的所有字符：^.{3,20}$
//    由26个英文字母组成的字符串：^[A-Za-z]+$
//    由26个大写英文字母组成的字符串：^[A-Z]+$
//    由26个小写英文字母组成的字符串：^[a-z]+$
//    由数字和26个英文字母组成的字符串：^[A-Za-z0-9]+$
//    由数字、26个英文字母或者下划线组成的字符串：^\w+$ 或 ^\w{3,20}$
//    中文、英文、数字包括下划线：^[\u4E00-\u9FA5A-Za-z0-9_]+$
//    可以输入含有^%&',;=?$\"等字符：[^%&',;=?$\x22]+
//    禁止输入含有~的字符：[^~\x22]+


//	特殊需求
//    Email地址：^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$
//    域名：[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(/.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+/.?
//    InternetURL：[a-zA-z]+://[^\s]* 或 ^http://([\w-]+\.)+[\w-]+(/[\w-./?%&=]*)?$
//    手机号码：^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$
//    电话号码("XXX-XXXXXXX"、"XXXX-XXXXXXXX"、"XXX-XXXXXXX"、"XXX-XXXXXXXX"、"XXXXXXX"和"XXXXXXXX)：^(\(\d{3,4}-)|\d{3.4}-)?\d{7,8}$
//    国内电话号码(0511-4405222、021-87888822)：\d{3}-\d{8}|\d{4}-\d{7}
//    身份证号(15位、18位数字)：^\d{15}|\d{18}$
//    短身份证号码(数字、字母x结尾)：^([0-9]){7,18}(x|X)?$ 或 ^\d{8,18}|[0-9x]{8,18}|[0-9X]{8,18}?$
//    帐号是否合法(字母开头，允许5-16字节，允许字母数字下划线)：^[a-zA-Z][a-zA-Z0-9_]{4,15}$
//    密码(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)：^[a-zA-Z]\w{5,17}$
//    强密码(必须包含大小写字母和数字的组合，不能使用特殊字符，长度在8-10之间)：^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$
//    日期格式：^\d{4}-\d{1,2}-\d{1,2}
//    一年的12个月(01～09和1～12)：^(0?[1-9]|1[0-2])$
//    一个月的31天(01～09和1～31)：^((0?[1-9])|((1|2)[0-9])|30|31)$
//    xml文件：^([a-zA-Z]+-?)+[a-zA-Z0-9]+\\.[x|X][m|M][l|L]$
//    中文字符的正则表达式：[\u4e00-\u9fa5]
//    双字节字符：[^\x00-\xff]    (包括汉字在内，可以用来计算字符串的长度(一个双字节字符长度计2，ASCII字符计1))
//    空白行的正则表达式：\n\s*\r    (可以用来删除空白行)
//    HTML标记的正则表达式：<(\S*?)[^>]*>.*?</\1>|<.*? />    (网上流传的版本太糟糕，上面这个也仅仅能部分，对于复杂的嵌套标记依旧无能为力)
//    首尾空白字符的正则表达式：^\s*|\s*$或(^\s*)|(\s*$)    (可以用来删除行首行尾的空白字符(包括空格、制表符、换页符等等)，非常有用的表达式)
//    腾讯QQ号：[1-9][0-9]{4,}    (腾讯QQ号从10000开始)
//    中国邮政编码：[1-9]\d{5}(?!\d)    (中国邮政编码为6位数字)
//    IP地址：\d+\.\d+\.\d+\.\d+    (提取IP地址时有用)
//    IP地址：((?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d))

//	钱的输入格式
//  1.有四种钱的表示形式我们可以接受:"10000.00" 和 "10,000.00", 和没有 "分" 的 "10000" 和 "10,000"：^[1-9][0-9]*$
//  2.这表示任意一个不以0开头的数字,但是,这也意味着一个字符"0"不通过,所以我们采用下面的形式：^(0|[1-9][0-9]*)$
//  3.一个0或者一个不以0开头的数字.我们还可以允许开头有一个负号：^(0|-?[1-9][0-9]*)$
//  4.这表示一个0或者一个可能为负的开头不为0的数字.让用户以0开头好了.把负号的也去掉,因为钱总不能是负的吧.下面我们要加的是说明可能的小数部分：^[0-9]+(.[0-9]+)?$
//	5.必须说明的是,小数点后面至少应该有1位数,所以"10."是不通过的,但是 "10" 和 "10.2" 是通过的：^[0-9]+(.[0-9]{2})?$
//	6.这样我们规定小数点后面必须有两位,如果你认为太苛刻了,可以这样：^[0-9]+(.[0-9]{1,2})?$
//	7.这样就允许用户只写一位小数.下面我们该考虑数字中的逗号了,我们可以这样：^[0-9]{1,3}(,[0-9]{3})*(.[0-9]{1,2})?$
//	8.1到3个数字,后面跟着任意个 逗号+3个数字,逗号成为可选,而不是必须：^([0-9]+|[0-9]{1,3}(,[0-9]{3})*)(.[0-9]{1,2})?$
//	备注：这就是最终结果了,别忘了"+"可以用"*"替代如果你觉得空字符串也可以接受的话(奇怪,为什么?)最后,别忘了在用函数时去掉去掉那个反斜杠,一般的错误都在这里

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

function delay(time) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, time);
    });
}

// polyfill安全的guard检查
if (!Promise.observe) {
    Promise.observe = function (pr, cb) {
// 观察pr的决议
        pr.then(
            function fulfilled(msg) {
// 安排异步回调（作为Job）
                Promise.resolve(msg).then(cb);
            },
            function rejected(err) {
// 安排异步回调（作为Job）
                Promise.resolve(err).then(cb);
            }
        );
// 返回最初的promise
        return pr;
    };
}

if (!Promise.wrap) {
    Promise.wrap = function (fn) {
        return function () {
            var args = [].slice.call(arguments);
            return new Promise(function (resolve, reject) {
                fn.apply(
                    null,
                    args.concat(function (err, v) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(v);
                        }
                    })
                );
            });
        };
    };
}

/**
 * check if a val is a real number
*/
function isNumber(val) {
    return typeof val === 'number' && isFinite(value);
}

/**
 * split a large array's handler to some small arrays' handler
 * @param {Array} array data array
 * @param {Function} process handler function
 * @param {Number} num Optional data num to handler in one time
 * @param {Number} delay Optional timeOut delay
 * @param {Object} callee Optional process's context
*/
function myChunck(array, process, num, delay, callee) {
    delay = delay || 100;
    num = num || 1;
    callee = callee || window;
    var newArray = array.slice( 0 );
    setTimeout( function foo () {
        var thisArray = newArray.splice( 0, num );
        process.apply( callee, [thisArray] );
        if ( newArray.length > 0 ) {
            setTimeout( foo, delay );
        }
    }, delay );
}

/**
 * make method just run one time between delay
 * @param {Function} method function that unwilling to run frequently
 * @param {Number} delay timeout delay
 * @param {Object} context method's this poniter
*/
function throttle ( method, delay, context ) {
    clearTimeout( method.tId );
    delay = delay || 100;
    context = context || window;
    method.tId = setTimeout( function () {
        method.call( context );
    } , delay );
}
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( window.navigator.userAgent );
}

var _$encode = function (_map, _content) {
    _content = '' + _content;
    if (!_map || !_content) {
        return _content || '';
    }
    return _content.replace(_map.r, function ($1) {
        var _result = _map[!_map.i ? $1.toLowerCase() : $1];
        return _result != null ? _result : $1;
    });
};

//防止脚本注入
var _$escape = (function () {
    var _reg = /<br\/?>$/,
        _map = {
            r: /\<|\>|\&|\r|\n|\s|\'|\"/g,
            '<': '&lt;', '>': '&gt;', '&': '&amp;', ' ': '&nbsp;',
            '"': '&quot;', "'": '&#39;', '\n': '<br/>', '\r': ''
        };
    return function (_content) {
        _content = _$encode(_map, _content);
        return _content.replace(_reg, '<br/><br/>');
    };
})();

var _$unescape = (function ( a ) {
    // var _reg = /&lt;br\/?&gt;&lt;br\/?&gt;$/,
    var _reg = /<br\/?><br\/?>$/,
        _map = {
            r: /&lt;|&gt;|&amp;|&nbsp;|&quot;|&#39;|<br\/>|<br>/g,
            '&lt;': "<",
            '&gt;': ">",
            '&amp;': "&",
            '&nbsp;': " ",
            '&quot;': '"',
            '&#39;': "'",
            '<br/>': "\n",
            '<br>': "\n",
        }
        return function ( _content ) {
            _content = _$encode( _map, _content );
            return _content.replace( _reg, "<br/>" );
        }
    })();