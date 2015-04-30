/**
 * Created by wangyc on 15-3-9.
 */
var express = require('express');
var async = require("async");
var router = express.Router();
var samples = require("../models/samples");
var config = require("../config");
var logger = require("../models/logger");

router.get('/', function (req, res, next) {

    var token = req.session.user;
    var isSuper = req.session.isSuper;
    if( token === undefined || isSuper === undefined) {
        logger.info("cannot get in the admin page");
        res.redirect("/index");
        return;
    }

    logger.info("overview");
    var _username = req.session.username;
    if (_username === null) {

        logger.info("not have cookie");
        res.redirect("/index");
    }

    var statsData = [];
    // var keywords = config.keywordList;
    // var topicid = req.query.topicid != undefined ? req.query.topicid : 8;
    var topicname = req.query.topicname != undefined ? req.query.topicname : "影视剧";
    var topic_list = config.topic_list;
    // get sub-topics by topicname
    var topic_items = topic_list[topicname];
    var topicids = []
    var topicnames = []
    logger.info(["topic_items:", topic_items])
    for (var item in topic_items) {
        // console.log(item);
        // console.log("name:", name);
        // console.log("value:", value);
        topicids.push(item);
        topicnames.push(topic_items[item]);

    }
    async.map(topicids, function(topicid, callback){

        samples.getStatsofSamples(topicid, function(status, msg){
            callback(null, msg);
        });
    }, function(err, results){

        var statsData = [];
        var categories = {
            0: "Labeled",
            1: "Conflict",
            2: "Trash",
            3: "Unlabeled"
        };
        // statsData format: 4*n
        for(var i=0; i<4; i++) {
            statsData.push({
                "name": categories[i],
                "data": []
            });
            for(var j=0; j<topicids.length; j++) {
                statsData[i]["data"].push(results[j][i]);
            }
        };
        logger.info(statsData);
        res.render("overview",
                   {title: config.title,
                    topicnames: topicnames,
                    topic_list: topic_list,
                    statsData: statsData
                });
    });
});

module.exports = router;
