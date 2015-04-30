/**
 * Created by neutronest on 2015-03-18
 */

var express = require("express");
var router = express.Router();
var async = require("async");
var samples = require("../models/samples");
var config = require("../config");
var logger = require("../models/logger");
// var Thread = require("./thread");
var thead = require("../models/thread");
router.get('/', function(req, res, next){


    var token = req.session.user;
    if(token === undefined) {

        logger.info("not login");
        res.redirect("/index");
    }
    var _username = req.session.username;
    // var _keyword = req.query.kw;
    var topicid = req.query.topicid != undefined ? req.query.topicid : 8;
    var topicname = req.query.topicname != undefined ? req.query.topicname : "盗墓笔记";
    // var keywords = config.keywordList;
    samples.getCountofIdsByConflict(topicid, function(status, amount){
        samples.getSamplesByConflict(topicid, function(status, rows){

            logger.info(rows);
            // set cookies
            if(rows.length) {

                req.session.threadID = rows[0]["threadid"];
                logger.info(rows[0]["threadid"]);
                req.session.topicid = topicid;
            }
            res.render("check",
                       {
                           title: config.title,
                           topicid: topicid,
                           topicname: topicname,
                           topic_list: config.topic_list,
                           username: _username,
                           rows: rows,
                           count: amount
                       });
        });
    });

});

router.post("/", function(req, res){

    logger.info("check");
    var token = req.session.user;
    if(token === undefined) {
        logger.info("not login");
        res.json({"status":"1", msg: "not login"});
    }
    var threadid = req.body.threadid;
    var topicid = req.body.topicid;
    // var _keyword = req.body.keyword;
    var trash = req.body.trash;

    logger.info([
        "threadid",
        threadid,
        "topicid",
        topicid,
        "trash: ",
        trash
    ]);

    if (trash == 0) {
        var username = req.body.username;
        var labels = req.body.labels;
        // upate the valid of target samples
        logger.info([
            username,
            labels,
            "checkConflict"
        ]);
        logger.info([username, labels, "checkConflict"]);
        samples.checkConflict(topicid, threadid, username, labels, function(status, msg){
            res.json({"status": status, "msg": msg});
        });

    } else {
        logger.info(_id);
        logger.info(["trash"]);
        // var thread = new Thread(_id, _keyword);
        thread.trash(threadid, topicid, function (status, msg) {
            res.json({'status': status, 'msg': msg});
        });
    }
});

module.exports = router;
