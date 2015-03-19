/**
 * Created by neutronest on 2015-03-18
 */

var express = require("express");
var router = express.Router();
var async = require("async");
var samples = require("../models/samples");
var config = require("../config");
var Thread = require("./thread");
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
    samples.getCountofIdsByConflict(_keyword, function(status, amount){
        samples.getSamplesByConflict(_keyword, function(status, rows){
            console.log(rows);
            // set cookies
            if(rows.length) {

                res.cookie.threadID = rows[0]["id"];
                console.log(rows[0]["id"]);
                res.cookie.keyword = _keyword;
            }
            res.render("check",
                       {
                           title: config.title,
                           keyword: _keyword,
                           rows: rows,
                           count: amount
                       });
        });
    });
    /**
    samples.getSamplesByConflict(_keyword, function(status, rows){
        console.log(rows);
        res.render("check",
                   {
                       title: config.title,
                       keyword: _keyword,
                       rows: rows
                   });
    });
     **/
});

router.post("/", function(req, res){

    console.log("check");
    var token = res.cookie.user;
    if(token === undefined) {

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
        console.log(_id);
        var thread = new Thread(_id, _keyword);
        thread.trash(function (status, msg) {
            res.json({'status': status, 'msg': msg});
        });
    }
});

module.exports = router;