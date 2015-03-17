/**
 * Created by wangyc on 15-2-26.
 */

var MysqlClient = require("../models/mysql");
var conn = MysqlClient.createConnection();

var user = (function(){

    var that = this;

    that.login = function(username, password, callback) {
        MysqlClient.getUserInfo(username, password, function(status, msg){
            console.log(status + ", " + msg);
            callback(status, msg);
        });
    };
    return {
        login: login
    };

})();

module.exports = user;
