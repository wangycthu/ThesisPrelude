/**
 * Created by wangyc on 15-3-9.
 */
var express = require('express');
var async = require("async");
var router = express.Router();
var samples = require("../models/samples");
var config = require("../config");


router.get('/', function (req, res, next) {

    console.log("overview");
    var _username = req.cookies.username;
    if (_username === null) {

        console.log("not have cookie");
        res.redirect("/index");
    }

    var statsData = [];
    var keywords = config.keywordList;

    async.map(keywords, function(item, callback){

        samples.getStatsofSamples(item, function(status, msg){
            callback(null, msg);
        });
    }, function(err, results){

        console.log(results);
        res.render("overview",
                   {title: config.title,
                    statsData: results});
    });
});

module.exports = router;
