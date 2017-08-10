import modules from "./modules/test"

var MT = function () {
    this.testParam = "Hello World";
    this.init();
};

MT.prototype.init = function () {
    if (typeof DEBUG !== "undefined") {
        console.log("init");
    }
    this.test();
    this.test2();
};

MT.prototype.test = modules.test;

MT.prototype.test2 = modules.test2;



module.exports = MT;