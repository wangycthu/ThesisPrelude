/**
 * Created by wangyc on 15-2-23.
 */
var express = require('express');
var router = express.Router();
// var Thread = require('./thread');
var thread = require("../models/thread");
var async = require("async");
var samples = require("../models/samples");
var user = require("../models/user");
var session = require("express-session");
var logger = require("../models/logger");
var config = require("../config");
router.get('/', function (req, res, next) {

    // check if login
    var token = req.session.user;
    logger.info(["token,", token]);
    console.log(["token", token]);
    if (token === undefined) {
        res.redirect("/index");
        return;
    }

    logger.info(["cookies.user", req.session.username]);
    var _username = req.session.username;
    // var _keyword = req.query.kw != "" ? req.query.kw : "iPhone6";
    var topicid = req.query.topicid != undefined ? req.query.topicid : 8;
    var topicname = req.query.topicname != undefined ? req.query.topicname : "盗墓笔记";

    var _labelCount = null;
    var _validateCount = null;

    async.waterfall([
        function (callback) {
            user.getUser(_username, function (status, msg) {

                if (status != 0) callback(1, "error");
                else {
                    logger.info(msg);
                    callback(null, {
                        "labelCount": msg["labelCount"],
                        "validateCount": msg["validateCount"]
                    });
                }
            });
        }
    ], function (err, result){
        if (err) {
            res.status(404).end();
        }
        samples.getSamplesByLabels(topicid, _username, function(status, msg){
            if (status != 0) {
                if (status === 2) {
                    logger.info(topicid + ": No data");
                    res.render('label', {
                        title: '微博标注平台',
                        topicid: topicid,
                        topicname: topicname,
                        topic_list: config.topic_list,
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
                logger.info(["labelCount: ", result['labelCount']]);
                res.render('label', {
                    title: '微博标注平台',
                    topicid: topicid,
                    topicname: topicname,
                    topic_list: config.topic_list,
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


router.post("/", function(req, res){

    var token = req.session.user;
    if ( token === undefined) {
        logger.info("not login");
        res.redirect("/index");
    }

    var threadid = req.body.threadid;
    var topicid = req.body.topicid;
    var trash = req.body.trash;
    var ifrelated = req.body.ifrelated;

    if(trash == 0) {
        logger.info("thread save");
        var username = req.body.username;
        var labels = req.body.labels;
        thread.save(threadid, topicid, username,
                    labels, ifrelated, function(status, msg){
                        res.json({"status": status, "msg": msg});
                    });
    } else {
        thread.trash(threadid, topicid, function(status, msg){
            res.json({"status": status, "msg": msg});
        });
    }
});


/*
 router.post('/', function (req, res) {

 console.log("label post");
 var token = req.session.user;
 if (token ===  undefined) {
 logger.info("not login");
 res.redirect("/index");
 }

 Var _id = req.body.id;
 var _keyword = req.body.keyword;
 var _trash = req.body.trash;
 var _if_related = req.body.if_related;
 if (_trash == 0) {
 var _username = req.body.username;
 var _labels = req.body.labels;
 var thread = new Thread(_id, _keyword, _username, _labels, _if_related);
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
*/
module.exports = router;
