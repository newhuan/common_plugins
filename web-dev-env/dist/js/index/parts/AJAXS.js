async function asyncRequest(params, callback) {
    try{
        let res = await this.request(params),
            data = checkJSON(res);
        if(!data){
            alert("服务器正忙，请稍候再试。");
            return false;
        }
        //handler data
        callback(data);
    }catch (e){
        if (typeof DEBUG !== "undefined") {
            console.log(params.url, e);
        }
    } finally {

    }

}

function request(params) {
    let that = this;
    return new Promise(function (resolve, reject) {
        //just test
        if(params.url === "test"){
            resolve(that.testData.data_test);
        }

        $.ajax({
            type: params.type,
            url: params.url,
            data: params.data,
            beforeSend: function (request) {
                if (!params.headers) {
                    return;
                }
                for (let key in params.headers) {
                    request.setRequestHeader(key, params.headers[key]);
                }
            },
            success: resolve(res),
            error: reject(e)
        });
    })
}

function testAjax() {
    let params = {
        url: "test",
        type: "get",
    };
    let callback = this.testDataHandler.bind(this);
    this.asyncRequest(params, callback).catch(function (e) {
        if (typeof DEBUG !== "undefined") {
            console.log("catch error", e);
        }
    });
}

module.exports = {
    request,
    asyncRequest,
    testAjax
};