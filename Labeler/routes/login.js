/**
 * Created by wangyc on 15-2-25.
 */
var express = require('express');
// var User = require('./user');
var user = require("../models/user");
var session = require("express-session");
var router = express.Router();
var sha1 = require('node-sha1');
var config = require("../config");
var logger = require("../models/logger");

router.post('/', function (req, res) {
    var _email = req.body.email;
    // password security
    var _password = req.body.password;

    user.login(_email, _password, function(status, msg){

        if (status == 0) {
            // set user session
            req.session.user = sha1("wyc" + msg["username"]);
            req.session.username = msg["username"];
            req.session.secure_proxy = config.secure_proxy;
            logger.info(["cookie user", req.session.user]); // debug
            logger.info("msg[username]: " + msg["username"]); // debug
            req.session.isSuper = msg['isSuper'];
        } else if(status == 1) {
            logger.info("db errors");
        } else if (status == 2) {
            logger.info("no users");
        } else {
            // no logic here
        }
        res.json({"status": status, "msg": msg});
    });
});

router.get('/', function (req, res) {
  alert("Don't do that");
  res.send("remain to complete.");
});

module.exports = router;
