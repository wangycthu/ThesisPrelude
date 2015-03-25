/**
 * Created by wangyc on 15-2-23.
 */
var express = require('express');
var router = express.Router();
var Thread = require('./thread');
var async = require("async");
var samples = require("../models/samples");
var user = require("../models/user");
var session = require("express-session");
router.get('/', function (req, res, next) {

  // check if login
  var token = req.session.user;
  console.log(["token", token]);
  if (token === undefined) {
    res.redirect("/index");
    return;
  }

  console.log(["cookies.user", req.session.username]);
  var _username = req.session.username;
  var _keyword = req.query.kw != "" ? req.query.kw : "iPhone6";

  // default select
  if (_keyword == null) {
    _keyword = 'iPhone6';
  }
  var _labelCount = null;
  var _validateCount = null;

  async.waterfall([
      function (callback) {
        user.getUser(_username, function (status, msg) {

          if (status != 0) callback(1, "error");
          else {
            console.log(msg);
            callback(null, {
              "labelCount": msg["labelCount"],
              "validateCount": msg["validateCount"]
            });
          }
        });
      }
    ],
    function (err, result){
      if (err) {
        res.status(404).end();
      }
      samples.getSamplesByLabels(_keyword, _username, function(status, msg){
        if (status != 0) {
          if (status === 2) {
            console.log(_keyword + ": No data");
            res.render('label', {
              title: '微博标注平台',
              keyword: _keyword,
              isSuper: req.session.isSuper,
              username: _username,
              rows: [],
              labelCount: result["labelCount"],
              validateCount: result["validateCount"]
            });
          } else {
            res.send("发生错误！");
          }
        } else {
          console.log(["labelCount: ", result['labelCount']]);
          res.render('label', {
            title: '微博标注平台',
            keyword: _keyword,
            isSuper: req.session.isSuper,
            username: _username,
            rows: msg,
            labelCount: result["labelCount"],
            validateCount: result["validateCount"]
          });
        }
      });
    });
});

router.post('/', function (req, res) {

  console.log("label post");
  var token = req.session.user;
  if (token ===  undefined) {
    console.log("not login");
    res.redirect("/index");
  }

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
