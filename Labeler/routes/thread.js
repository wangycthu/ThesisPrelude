/**
 * Created by wangyc on 15-2-27.
 */

var MysqlClient = require("../models/mysql");
var conn = MysqlClient.createConnection();

function Thread(_id, _keyword, _username, _labels) {
  this.id = _id;
  this.keyword = _keyword;
  this.username = arguments[2] ? arguments[2] : null;
  this.labels = arguments[3] ? JSON.parse(arguments[3]) : null; //Array
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
        }
    );
  };

  this.trash = function (callback) {
      var that = this;
      console.log([
          "in the tread:,", _keyword,
          "id: ", _id
      ]);
      // set label1 = label2 = 2
      var _query = "UPDATE ?? set label1=2, label2=2  WHERE id = ?  ";
    conn.query(_query, [_keyword, _id],
        function (err, res) {
          if (err) {
            callback(0, "Trash data failed.");
          }
          else callback(1, null);
        }
    );
  };


}

module.exports = Thread;
