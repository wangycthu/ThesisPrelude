/**
 * Created by wangyc on 15-2-23.
 */
var express = require('express');
var router = express.Router();
var Thread = require('./thread');

var mysql = require('mysql');
var conn = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '199283155wyc',
  database: 'Microblog',
  charset: 'UTF8MB4'
});

var keywordList = {
  'iPhone6': 'iPhone6', 'MaYun': '马云',
  'Marriage': '结婚', 'InterStellar': '星际穿越',
  'BaBaQuNar': '爸爸去哪儿', 'DoubleEleven': '双十一',
  'DuJiaoShou': '都教授', 'Frozen': '冰雪奇缘',
  'RunningMan': '奔跑吧兄弟', 'WuMai': '雾霾',
  'XiaoLongNv': '小龙女'
};

router.get('/', function (req, res, next) {
  var _username = req.cookies.username;
  var _keyword = req.query.kw;
  if (_keyword == null) {
    _keyword = 'iPhone6'
  }
  var _query = 'select distinct id from ' + _keyword +
      ' where (label1 is NULL) or (user1 != \'' + _username +
      '\' and label2 is NULL) limit 1';
  conn.query(_query, function (err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      if (rows.length) {
        var _id = rows[0]['id'];
        conn.query('select * from ' + _keyword +
            ' where id=' + _id,
            function (err, _rows, fields) {
              if (err) {
                console.log(err);
              } else {
                res.render('label', {
                  keyword: keywordList[_keyword],
                  username: _username,
                  rows: _rows
                });
              }
            }
        );
      } else {
        // TODO: show 'This topic has been finished.'
      }
    }
  });
});

router.post('/', function (req, res) {
  var _id = req.body.id;
  var _keyword = req.body.keyword;
  var labels = req.body.labels;
  var thread = new Thread(_id, _keyword, labels);
  thread.save(function (status, msg) {
    res.json({'status': status, 'msg': msg})
  });
});

module.exports = router;
