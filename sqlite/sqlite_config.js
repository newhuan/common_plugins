let config = {
    dev: {
        database: ":memory:"
    },
    prd: {
        //次路径是相对于[运行的js文件]的相对路径
        //而不是引入db对象的js文件
        database: "./sqlite/account.db"
    }
};
module.exports = config;