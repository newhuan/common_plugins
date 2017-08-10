// import CONFIG from "Public/CONFIG.js";
// import DEBUG from "Public/CONFIG.js";
import CONFIG from "../public/CONFIG.js";
import MT from "./init";
// import $ from "jquery";
import "../../css/index/index.scss"

window.DEBUG = CONFIG.DEBUG;
window.ROOT = CONFIG.ROOT;
window.CONFIG = CONFIG.CONFIG;

let a = new Promise(function (resolve, reject) {
    resolve(1);
});
a.then(function(p){
    console.log("233", p, "index", $, CONFIG);
});
var b = 1;
if (typeof DEBUG !== "undefined") {
    console.log("watch me!");
}
console.log(b, "223");
var my = new MT();
throw "test error";