/**
 * Created by wangyc on 15-2-26.
 */

var mysql_conn = require("../models/mysqlv2");
// console.log(mysql_conn.pool);
// var conn = MysqlClient.createConnection();
var sha1 = require("node-sha1");
var config = require("../config");
var logger = require("../models/logger");

var user = (function(){

    var that = this;
    console.log(mysql_conn.pool);
    that.login = function(email, password, callback) {
        mysql_conn.getUserInfo(email, sha1(config.secure_proxy + password), function(status, msg){
            logger.info([status, msg]);
            callback(status, msg);
        });
    };

    that.getUser = function(username, callback) {
        mysql_conn.getUser(username, function(status, msg){
            if(status != 0) callback(1, "db error");
            else callback(0, msg);
        });
    };

    that.register = function(username, email, password, isSuper, callback){

        mysql_conn.getUserByEmail(email, function(status, rows){

            if(rows.length) callback("3", "this email has registed!");
            else {
                password = sha1(config.secure_proxy + password);
                mysql_conn.insertUser(username, email, password, isSuper, function(status, msg){
                    callback(status, msg);
                });
            } 
        });
        
    }
    
    return {
        login: login,
        getUser: getUser,
        register: register
    };

})();

module.exports = user;
