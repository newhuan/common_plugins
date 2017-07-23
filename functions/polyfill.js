if (!Number.EPSILON) {
    Number.EPSILON = Math.pow(2,-52);
}

//浮点数近似相等
function numbersCloseEnoughToEqual(n1,n2) {
    return Math.abs( n1 - n2 ) < Number.EPSILON;
}

if (!Number.isInteger) {//if number is integer
    Number.isInteger = function(num) {
        return typeof num == "number" && num % 1 == 0;
    };
}

if (!Number.isSafeInteger) {
    Number.isSafeInteger = function(num) {
        return Number.isInteger( num ) && Math.abs( num ) <= Number.MAX_SAFE_INTEGER;
    };
}

if (!Number.isNaN) {
    Number.isNaN = function(n) {
        return (typeof n === "number" && window.isNaN( n ));
    };
}
// if (!Number.isNaN) {//利用NaN是js中唯一一个非自反的值
// Number.isNaN = function(n) {
// return n !== n;
// };
// }

function isNegZero(n) {//是否 -0
    n = Number( n );
    return (n === 0) && (1 / n === -Infinity);
}

if (!Object.is) {//判断是否绝对相等
    Object.is = function(v1, v2) {
    // 判断是否是-0
    if (v1 === 0 && v2 === 0) {
        return 1 / v1 === 1 / v2;
    }
    // 判断是否是NaN
    if (v1 !== v1) {
        return v2 !== v2;
    }
    // 其他情况
        return v1 === v2;
    };
}

function clearArray(array) {//清空数组
    array.length = 0;
}

function varType(variable) {
    var str = Object.prototype.toString.call(variable).toLowerCase(),
        reg = new RegExp(/\s([a-z]*)\]/);
    str = str.match(reg)[0];
    str = str.split(' ').join("").split("]").join("");
    return str;
}

























