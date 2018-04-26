let DataCache = (function () {
    let Cache = function Cache(argument) {
        this.testList = [];

    };

    Cache.prototype.setTestList = function (list) {
        this.testList = list;
    };

    Cache.prototype.getTestList = function () {
        return this.testList;
    }



    return Cache;
})();

let cache = new DataCache();

export default cache;