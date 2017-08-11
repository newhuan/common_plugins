// import CONFIG from "Public/CONFIG.js";
// import DEBUG from "Public/CONFIG.js";
import CONFIG from "../public/CONFIG.js";
import CACHE from "./cache/cache"
import MT from "./init";
import DATA from "./data/testData"//modules.exports 时 import的是一个对象
// import $ from "jquery";
// import "../../css/index/indexc.scss"

window.DEBUG = CONFIG.DEBUG;
window.ROOT = CONFIG.ROOT;
window.CONFIG = CONFIG.CONFIG;

let cache = CACHE.cache,
    testData = DATA.testData;

let my = new MT.MT(cache, testData);
