/**
 * Created by wangyc on 15-2-26.
 */
var config = require("../config");
var sha1 = require('node-sha1');
var MysqlClient = require("../models/mysql");
var conn = MysqlClient.createConnection();
var logger = require("../models/logger");

function User(_username, _email,  _password, isSuper) {
    this.username = _username;
    this.password = _password;
    this.email = _email;
    this.isSuper = arguments[2] ? arguments[2] : false;

    this.Login = function (callback) {
        var that = this;
        conn.query(
            'select * from UserInfo where email=\'' + that.email + '\' limit 1',
            function (err, rows, fields) {

                if (err) {
                    logger.info("ERR: " + err);
                    callback(0, err);
                }
                else if (rows.length) {
                    if (rows[0]['password'] === that.password) {
                        callback(1, rows[0]);
                    } else {
                        callback(0, 'password error.');
                    }
                } else {
                    callback(0, 'user doesn\'t exist.');
                }
            }
        );
    };

    this.Register = function (callback) {
        var that = this;
        conn.query(
            'select * from UserInfo where email=\'' + that.email + '\' limit 1',
            function (err, rows, fields) {
                if (err) {
                    callback(1, err);
                }
                if (rows.length) {
                    callback(2, 'email has been registered.');
                } else {
                    var _query = "INSERT INTO UserInfo "
                            + "(username, email, password, isSuper, labelCount, validateCount) values "
                            + " ( ? , ? , ? , default, default, default )";
                    conn.query( _query, [that.username, that.email, sha1(config.secure_proxy + that.password)],
                                function (err, res) {
                                    if (err) {
                                        callback(1, "save user error.");
                                    }
                                    callback(0, that);
                                }
                              );
                }
            }
        );
    };
}

module.exports = User;
