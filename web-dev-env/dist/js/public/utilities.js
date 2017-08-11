function checkJSON(msg) {
    if(!msg){
        return false;
    }
    var data,
        flag = true;
    if(typeof msg === "string"){
        try {
            data = JSON.parse(msg);
        }catch(e) {
            flag = false;
        }
    }else {
        data = msg;
    }
    if(!flag){
        return false;
    }
    return data;
}