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

    var keywords = config.keywordList;
    res.render("check",
              {
                  title: config.title,
                  keywords: keywords
              });

});

module.exports = router;
