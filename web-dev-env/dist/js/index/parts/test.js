// import $ from "jquery";
function test() {
    this.initTestNode();
    this.addTestEvent();
}

function initTestNode() {

}

function addTestEvent() {

}

function test2() {
    if (typeof DEBUG !== "undefined") {
        console.log(this.testParam);
    }
    console.log("testData", this.testData.data_test);
}

function testDataHandler(data) {
    if (typeof DEBUG !== "undefined") {
        console.log("testDataHandler", data);
    }
    if (data.msgId === "0200") {//成功

    } else if (data.msgId === "0414") {//

    } else {
        alert("服务器正忙，请稍候再试！");
    }

}


module.exports = {
    test,
    test2,
    testDataHandler,
    initTestNode,
    addTestEvent
};