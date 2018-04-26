export { getUrlParam } from './url';
export { delCookie, readCookie, setCookie } from './cookie';
export { MD5 } from './encrypt';

export function wait(time) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, time);
    });
}

//防止脚本注入
export let _$escape = (function () {
    let _reg = /<br\/?>$/,
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

export let _$unescape = (function ( a ) {
    // var _reg = /&lt;br\/?&gt;&lt;br\/?&gt;$/,
    let _reg = /<br\/?><br\/?>$/,
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