var config = require("../config");
var mysql = require('mysql');
/*
var conn = mysql.createConnection({
    host: config.mysql_connect.host,
    port: config.mysql_connect.port,
    user: config.mysql_connect.user,
    password: config.mysql_connect.password,
    database: config.mysql_connect.database,
    charset: config.mysql_connect.charset
});
*/



var MysqlClient = (function() {

    var that = this;
    that.pool = null;
    that.createConnection = function () {

        var conn = mysql.createConnection({
            host: config.mysql_connect.host,
            port: config.mysql_connect.port,
            user: config.mysql_connect.user,
            password: config.mysql_connect.password,
            database: config.mysql_connect.database,
            charset: config.mysql_connect.charset
        });
        return conn;
    };

    that.createPool = function () {

        var pool = mysql.createPool({
            // mysql setting
            connectionLimit: 500,
            host: config.mysql_connect.host,
            port: config.mysql_connect.port,
            user: config.mysql_connect.user,
            password: config.mysql_connect.password,
            database: config.mysql_connect.database,
            charset: config.mysql_connect.charset
        });
        that.pool = pool;
    };
    that.getConnection = function() {
        var conn = that.pool.getConnection(function(err, connection) {
        });

        return conn;
    };

    return {
        createConnection: createConnection
    };
})();

module.exports = MysqlClient;
