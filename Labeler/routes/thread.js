/**
 * Created by wangyc on 15-2-27.
 */
var mysql = require('mysql');
var conn = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '199283155wyc',
  database: 'Microblog',
  charset: 'UTF8MB4'
});

function Thread(_id, _keyword, _username, _labels) {
  this.id = _id;
  this.keyword = _keyword;
  this.username = _username;
  this.labels = _labels; //Array
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
          console.log(that.labels);
          for (var record in that.labels) {
            var label = null;
            switch (record['label']) {
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
                that.id + ' and number=' + record['number'],
                function (err, res) {
                  if (err) {
                    callback(0, "Update table " + that.keyword + " error.");
                  }
                  conn.query(
                      'update UserInfo set labelCount=labelCount+1 where username=' + that.username,
                      function (err, res) {
                        if (err) {
                          callback(0, "Update UserInfo failed.");
                        }
                        callback(1, that);
                      }
                  );
                });
          }
        });
  }
}

module.exports = Thread;