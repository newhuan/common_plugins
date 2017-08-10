import CONFIG from "../public/CONFIG.js";
window.DEBUG = CONFIG.DEBUG;
window.ROOT = CONFIG.ROOT;
window.CONFIG = CONFIG.CONFIG;

let a = new Promise(function (resolve, reject) {
    resolve(1);
});

a.then(function(p){
    console.log(p, "test");
    if (typeof DEBUG !== "undefined") {
        console.log("debug is true");
    }
});