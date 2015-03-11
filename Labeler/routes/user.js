/**
 * Created by wangyc on 15-2-26.
 */

var MysqlClient = require("../models/mysql");
var conn = MysqlClient.createConnection();

function User(_username, _password, isSuper) {
  this.username = _username;
  this.password = _password;
  this.isSuper = arguments[2] ? arguments[2] : false;

  this.Login = function (callback) {
    var that = this;
    conn.query(
        'select * from UserInfo where username=\'' + that.username + '\' limit 1',
        function (err, rows, fields) {

          if (err) {
              console.log("ERR: " + err);
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
        'select * from UserInfo where username=\'' + that.username + '\' limit 1',
        function (err, rows, fields) {
          if (err) {
            callback(0, err);
          }
          if (rows.length) {
            callback(0, 'username has been registered.');
          } else {
            conn.query(
                'insert into UserInfo values(\'' + that.username + '\', ' + '\'' +
                that.password + '\', default, default, default)',
                function (err, res) {
                  if (err) {
                    callback(0, "save user error.");
                  }
                  callback(1, that);
                }
            );
          }
        }
    )
  }
}

module.exports = User;
