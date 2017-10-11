let pg = require("pg");
//postgreSQL
let config = {
    "user":"mituresdev2",
    "database":"mituresdev2",
    "password":"",
    "port": 5432
};

let pg_pool = new pg.Pool(config);

/*
pg 链接测试
pg_pool.connect(function (err, client, done) {

    if (err) {
        return console.error("数据库链接错误",err);
    }
    client.query("select * from user_background",[], function(err, result){
        done();
        if (err){
            return console.error("查询错误", err);
        }
        console.log(result.rows[0]);
    })
});
*/
let pg_opeartor = {
    insert:function(table, sql, params, func){
        pg_pool.connect(function(err, client, done){
            if (err) {
                func(err,null);
            }
            client.insert("")
        });
    },
    query:function(table, sql, params, func){

    }
};

module.exports = {pg_pool, pg_opeartor};