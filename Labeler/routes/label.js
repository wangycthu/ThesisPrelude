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
    var token = res.cookie.user;
    if (token === undefined) {
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

    async.waterfall([

        function(callback) {

            user.getUser(_username, function(status, msg){

                if(status != 0) callback(1, "error");
                else {
                    console.log(msg);
                    callback(null, {
                        "labelCount": msg[0]["labelCount"],
                        "validateCount": msg[0]["validateCount"]
                    });
                }
            });
        }
    ], function (err, result){
        samples.getSamplesByLabels(_keyword, _username, function(status, msg){

            if(status != 0) {
                res.send("发生错误！");
            } else {
                res.render('label', {
                    title: '微博标注平台',
                    keyword: _keyword,
                    isSuper: res.cookie.isSuper,
                    username: _username,
                    rows: msg,
                    labelCount: result["labelCount"],
                    validateCount: result["validateCount"]
                });
            }
        });

    });
    /**
  conn.query(
      'select * from UserInfo where username=\'' + _username + '\'',
      function(err, rows, fields) {
        if (err) {
          console.log(err);
        } else {
          _labelCount = rows[0]['labelCount'];
          _validateCount = rows[0]['validateCount'];
        }
      }
  );

  var _query = 'select count(*) from ' + _keyword +
      ' where number = 0 and ((label1 is NULL) or (user1 != \'' + _username +
      '\' and label2 is NULL)) and (username != \'USERNAME\')';

  conn.query(_query, function(err, rows, fields) {
    if (err) {
      console.log("Error: get count(*) of unlabeled.");
    } else {
      var rdmlimit = Math.floor(Math.random() * rows[0]['count(*)']);
      _query = 'select id from ' + _keyword +
      ' where number = 0 and ((label1 is NULL) or (user1 != \'' + _username +
      '\' and label2 is NULL)) and (username != \'USERNAME\') limit ' + rdmlimit + ',1';
      conn.query(_query, function (err, rows, fields) {
        if (err) {
          console.log(err);
        } else {
          if (rows.length) {
            var _id = rows[0]['id'];
            conn.query('select * from ' + _keyword + ' where id=' + _id,
                function (err, _rows, fields) {
                  if (err) {
                    console.log(err);
                  } else {
                    res.render('label', {
                      title: '微博标注平台',
                      keyword: _keyword,
                      username: _username,
                      rows: _rows,
                      labelCount: _labelCount,
                      validateCount: _validateCount
                    });
                  }
                }
            );
          } else {
            // TODO: show 'This topic has been finished.'
          }
        }
      });
        **/
});


router.post('/', function (req, res) {
  var _id = req.body.id;
  var _keyword = req.body.keyword;
  var _trash = req.body.trash;
  if (_trash == 0) {
    var _username = req.body.username;
    var _labels = req.body.labels;
    var thread = new Thread(_id, _keyword, _username, _labels);
    thread.save(function (status, msg) {
      res.json({'status': status, 'msg': msg});
    });
  } else {
    var thread = new Thread(_id, _keyword);
    thread.trash(function (status, msg) {
      res.json({'status': status, 'msg': msg});
    });
  }
});

module.exports = router;
