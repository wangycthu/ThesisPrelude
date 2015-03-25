/**
 * Created by wangyc on 15-2-26.
 */

var MysqlClient = require("../models/mysql");
var conn = MysqlClient.createConnection();

var user = (function(){

    var that = this;

    that.login = function(email, password, callback) {
        MysqlClient.getUserInfo(email, password, function(status, msg){
            console.log([status, msg]);
            callback(status, msg);
        });
    };

    that.getUser = function(username, callback) {
        MysqlClient.getUser(username, function(status, msg){
            if(status != 0) callback(1, "db error");
            else callback(0, msg);
        });
    };
    return {
        login: login,
        getUser: getUser
    };

})();

module.exports = user;
