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
    var keywords = config.keywordList;

    async.map(keywords, function(item, callback){

        samples.getStatsofSamples(item, function(status, msg){
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
            for(var j=0; j<keywords.length; j++) {
                statsData[i]["data"].push(results[j][i]);
            }
        };
        logger.info(statsData);
        res.render("overview",
                   {title: config.title,
                    keywords: keywords,
                    statsData: statsData
                });
    });
});

module.exports = router;
