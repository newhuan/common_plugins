import modules from "./parts/test";
import AJAXs from "./parts/AJAXS";

let MT = function (cache, testData) {
    this.testParam = "Hello World";
    this.cache = cache;
    this.testData = testData;

    this.init();
};

MT.prototype.init = function () {
    if (typeof DEBUG !== "undefined") {
        console.log("init");
    }
    this.cache.setTestList([1,2,3]);
    this.test();
    this.test2();

    this.testAjax();


};

/**
 * test part
*/
MT.prototype.test = modules.test;

MT.prototype.initTestNode = modules.initTestNode;

MT.prototype.addTestEvent = modules.addTestEvent;

MT.prototype.testDataHandler = modules.testDataHandler;
/**
 * test part end
*/

/**
 * test2 part
*/
MT.prototype.test2 = modules.test2;


/**
 * test2 part end
*/

/**
 * AJAXs part
*/
MT.prototype.request = AJAXs.request;

MT.prototype.asyncRequest = AJAXs.asyncRequest;

MT.prototype.testAjax = AJAXs.testAjax;

/**
 * AJAXs part end
*/

module.exports = {
    MT
};