/**
 * Created by huhanwen on 2017/9/4.
 */
/**
 * polyfill of bind
 * @param {}
 * @returns {}
 */
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {
            },
            fBound = function () {
                return fToBind.apply(this instanceof fNOP
                    ? this
                    : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        if (this.prototype) {
            // Function.prototype doesn't have a prototype property
            fNOP.prototype = this.prototype;
        }
        fBound.prototype = new fNOP();

        return fBound;
    };
}

/**
 * check if json string is legal
 * @param { String } msg response string from server
 * @returns { Boolean|Object } if param is illegal return false;else return object parsed by response string
 */
function checkJSON(msg) {
    if (!msg) {
        return false;
    }
    var data,
        flag = true;
    if (typeof msg === "string") {
        try {
            data = JSON.parse(msg);
        } catch (e) {
            flag = false;
        }
    } else {
        data = msg;
    }
    if (!flag) {
        return false;
    }
    return data;
}

/**
 * city selector
 */
var nameEl = document.getElementById('item-choose-city');

var first = [];
/* 省，直辖市 */
var second = [];
/* 市 */
var third = [];
/* 镇 */

var selectedIndex = [0, 0, 0];
/* 默认选中的地区 */

var checked = [0, 0, 0];

/* 已选选项 */

function creatList(obj, list) {
    obj.forEach(function (item, index, arr) {
        var temp = new Object();
        temp.text = item.name;
        temp.value = index;
        list.push(temp);
    })
}

creatList(city, first);

if (city[selectedIndex[0]].hasOwnProperty('sub')) {
    creatList(city[selectedIndex[0]].sub, second);
} else {
    second = [{text: '', value: 0}];
}

if (city[selectedIndex[0]].sub[selectedIndex[1]].hasOwnProperty('sub')) {
    creatList(city[selectedIndex[0]].sub[selectedIndex[1]].sub, third);
} else {
    third = [{text: '', value: 0}];
}

var picker = new Picker({
    data: [first, second, third],
    selectedIndex: selectedIndex,
    title: '地址选择'
});

picker.on('picker.select', function (selectedVal, selectedIndex) {
    var text1 = first[selectedIndex[0]].text;
    var text2 = second[selectedIndex[1]].text;
    var text3 = third[selectedIndex[2]] ? third[selectedIndex[2]].text : '';
    //tip:: change value
    console.log("legal ?", isAddressLegal2(text1, text2, text3) );
    if ( isAddressLegal(selectedIndex) ) {
        nameEl.innerText = text1 + ' ' + text2 + ' ' + text3;

    } else {
        nameEl.innerText = "地址非法，请重新选择！";
    }
});

window.getCityObj = getCityObj();

function isAddressLegal( pro, cit, are ) {
    var cityObj = !!window.cityObj ? window.cityObj : getCityObj();
    return ( !!cityObj[ pro ]  && !!cityObj[ pro ][ cit ] && cityObj[ pro ][ cit ][ are ] );
}

function getCityObj() {
    var cityObj = {};
    var len = city.length;
    for ( var i = 0; i < len; ++i ) {
        var pro = city[ i ];
        cityObj[ pro.name ] = {};
        if ( !!pro.sub && pro.sub.length > 0 ) {
            //省下有市的数据且市的数据不为0
            var cit = pro.sub;
            for ( var j = 0; j < cit.length; ++j ) {
                cityObj[ pro.name ][ cit[ j ].name ] = {};
                if ( !!cit[ j ].sub && cit[ j ].sub.length > 0 ) {
                    //市下有区的数据且区的数据长度不为0（五指山）
                    var are = cit[ j ].sub;
                    for ( var k = 0; k < are.length; ++k ) {
                        cityObj[ pro.name ][ cit[ j ].name ][ are[ k ].name ] = true;
                    }
                } else {
                    //市下无区的数据，或区的数据长度为0
                   cityObj[ pro.name ][ cit[ j ].name ][ "" ] = true;
                }
            }
        } else {
            //省下无市的数据
            cityObj[ pro.name ][ "" ] = {};
            cityObj[ pro.name ][ "" ][ "" ] = true;
        }
    }
    return cityObj;
}

// function isAddressLegal( selectedIndex ) {
//     var i,
//         j,
//         k,
//         item,
//         sub,
//         subArea,
//         provinceIndex = selectedIndex[ 0 ],
//         cityIndex = selectedIndex[ 1 ],
//         areaIndex = selectedIndex[ 2 ];
//     //get output address names
//     var len = city.length,
//         provinceName = first[ provinceIndex ].text,
//         cityName = second[ cityIndex ].text,
//         areaName = third[ areaIndex ] ? third[ areaIndex ].text : "";
//     //check address legality
//     for ( i = 0; i < len; ++i ) {
//         item = city[ i ];
//         if ( item.name === provinceName ) {
//             sub = item.sub;
//             if ( !sub ) {
//                 return ( cityName === "" && areaName === ""  );
//             }
//
//             for ( j = 0; j < sub.length; ++j ) {
//                 if ( sub[ j ].name === cityName ) {
//                     subArea = sub[ j ].sub;
//                     if ( !subArea ) {
//                         return areaName === "";
//                     }
//
//                     for ( k = 0; k < subArea.length; ++k ) {
//                         if ( subArea[ k ].name === areaName ) {
//                             return true;
//                         }
//                     }
//                     return false;
//                 }
//             }
//             return false;
//         }
//     }
//     return false;
// }

picker.on('picker.change', function (index, selectedIndex) {
    if (index === 0) {
        firstChange();
    } else if (index === 1) {
        secondChange();
    }

    function firstChange() {
        second = [];
        third = [];
        checked[0] = selectedIndex;
        var firstCity = city[selectedIndex];
        if (firstCity.hasOwnProperty('sub')) {
            creatList(firstCity.sub, second);

            var secondCity = city[selectedIndex].sub[0]
            if (secondCity.hasOwnProperty('sub')) {
                creatList(secondCity.sub, third);
            } else {
                third = [{text: '', value: 0}];
                checked[2] = 0;
            }
        } else {
            second = [{text: '', value: 0}];
            third = [{text: '', value: 0}];
            checked[1] = 0;
            checked[2] = 0;
        }

        picker.refillColumn(1, second);
        picker.refillColumn(2, third);
        picker.scrollColumn(1, 0)
        picker.scrollColumn(2, 0)
    }

    function secondChange() {
        third = [];
        checked[1] = selectedIndex;
        var first_index = checked[0];
        if (city[first_index].sub[selectedIndex].hasOwnProperty('sub')) {
            var secondCity = city[first_index].sub[selectedIndex];
            creatList(secondCity.sub, third);
            picker.refillColumn(2, third);
            picker.scrollColumn(2, 0)
        } else {
            third = [{text: '', value: 0}];
            checked[2] = 0;
            picker.refillColumn(2, third);
            picker.scrollColumn(2, 0)
        }
    }

});

picker.on('picker.valuechange', function (selectedVal, selectedIndex) {
    console.log(selectedVal);
    console.log(selectedIndex);
});

nameEl.addEventListener('click', function () {
    picker.show();
});
