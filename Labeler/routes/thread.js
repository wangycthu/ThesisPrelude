/**
 * Created by wangyc on 15-2-27.
 */


var MysqlClient = require("../models/mysql");
var conn = MysqlClient.createConnection();

console.log("in thread.js: conn");
console.log(conn);

function Thread(_id, _keyword, _username, _labels) {
  this.id = _id;
  this.keyword = _keyword;
  this.username = _username;
  this.labels = JSON.parse(_labels); //Array
  this.save = function (callback) {
    var that = this;
    conn.query(
        'select label1, user1, label2, user2 from ' + that.keyword
        + ' where id=' + that.id + ' limit 1',
        function (err, rows, fields) {
          if (err) {
            callback(0, err);
          }
          var row = rows[0];
          var order = '1';
          if (row['label1'] && row['user1'] != that.username) {
            order = '2';
          }

          for (var number in that.labels) {
            var label = null;
            switch (that.labels[number]) {
              case 'positive':
                label = 1;
                break;
              case 'neutral':
                label = 0;
                break;
              case 'negative':
                label = -1;
                break;
              default:
                label = 'NULL';
            }
            conn.query(
                'update ' + that.keyword + ' set label' + order + '=' + label
                + ', user' + order + '=\'' + that.username + '\' where id=' +
                that.id + ' and number=' + number,
                function (err, res) {
                  if (err) {
                    callback(0, "Update table " + that.keyword + " error.");
                  }
            });
          }
          conn.query(
              'update UserInfo set labelCount=labelCount+1 where username=\'' + that.username + '\'',
              function (err, res) {
                if (err) {
                  callback(0, "Update UserInfo failed.");
                }
                callback(1, null);
          });
        });
  }
}

module.exports = Thread;
