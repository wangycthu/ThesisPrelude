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

function Thread(_id, _keyword, _labels) {
  this.id = _id;
  this.keyword = _keyword;
  this.labels = _labels; //list
  this.save = function (callback) {
    var that = this;
    for (var record in this.labels) {
      //TODO: insert label record 1 or 2
      conn.query('update table ' + that.keyword +
      'set');
    }
  }
}

module.exports = Thread;