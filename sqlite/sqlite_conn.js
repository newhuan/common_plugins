var config = require("./sqlite_config");
// let env = "dev";
let env = "prd";

let database = config[ env ].database;
var sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database( database );

module.exports = db;