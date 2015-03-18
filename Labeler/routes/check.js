/**
 * Created by neutronest on 2015-03-18
 */

var express = require("express");
var router = express.Router();
var async = require("async");
var samples = require("../models/samples");
var config = require("../config");

router.get('/', function(req, res, next){

    console.log("check");
    var token = res.cookie.user;
    if(token === undefined) {

        console.log("not login");
        res.redirect("/index");
    }
    var _username = req.cookies.username;
    var _keyword = req.query.kw;
    // default select
    if (_keyword == null) {
        _keyword = 'iPhone6';
    }
    var keywords = config.keywordList;
    samples.getSamplesByConflict(_keyword, function(status, rows){

        res.render("check",
                   {
                       title: config.title,
                       keywords: keywords,
                       rows: rows
                   });
    });
});

module.exports = router;
