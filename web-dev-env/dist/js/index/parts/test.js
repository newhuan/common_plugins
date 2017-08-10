// import $ from "jquery";
function test() {
    console.log("test1");
    if (typeof DEBUG !== "undefined") {
        console.log("test2", $("a").html());
    }
}

function test2() {
    if (typeof DEBUG !== "undefined") {
        console.log(this.testParam);
    }
}

module.exports = {
    test,
    test2,
};