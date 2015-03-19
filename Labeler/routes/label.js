/**
 * Created by wangyc on 15-2-23.
 */
var express = require('express');
var router = express.Router();
var Thread = require('./thread');
var async = require("async");
// var MysqlClient = require("../models/mysql");
// var conn = MysqlClient.createConnection();
var samples = require("../models/samples");
var user = require("../models/user");
router.get('/', function (req, res, next) {

  // check if login
  if (res.cookie.user == undefined) {
    res.redirect("/index");
    return;
  }
  var _username = req.cookies.username;
  var _keyword = req.query.kw;
  // default select
  if (_keyword == null) {
    _keyword = 'iPhone6'
  }
  var _labelCount = null;
  var _validateCount = null;

  // test
  console.log("cookies");
  console.log(res.cookie.user);

  async.waterfall([

    function (callback) {

      user.getUser(_username, function (status, msg) {

        if (status != 0) callback(1, "error");
        else {
          console.log(msg);
          callback(0, {
            "labelCount": msg[0]["labelCount"],
            "validateCount": msg[0]["validateCount"]
          });
        }
      });
    },

    function (err, count) {

      samples.getSamplesByLabels(_keyword, _username, function (status, msg) {

        if (status != 0) {
          res.send("发生错误！");
        } else {
          res.render('label', {
            title: '微博标注平台',
            keyword: _keyword,
            username: _username,
            rows: msg,
            labelCount: count["labelCount"],
            validateCount: count["validateCount"]
          });
        }
      });

    }
  ]);
});

router.post('/', function (req, res) {
  var _id = req.body.id;
  var _keyword = req.body.keyword;
  var _username = req.body.username;
  var _trash = req.body.trash;
  if (_trash == 0) {
    var _labels = req.body.labels;
    var thread = new Thread(_id, _keyword, _username, _labels);
    thread.save(function (status, msg) {
      res.json({'status': status, 'msg': msg})
    });
  } else {
    var thread = new Thread(_id, _keyword, _username);
    thread.trash(function (status, msg) {
      res.json({'status': status, 'msg': msg})
    });
  }
});

module.exports = router;
