/**
 * Created by wangyc on 15-2-25.
 */
var express = require('express');
// var User = require('./user');
var user = require("../models/user");
var router = express.Router();
var sha1 = require('node-sha1');

router.post('/', function (req, res) {
    var _username = req.body.userName;
    var _password = req.body.password;

    user.login(_username, _password, function(status, msg){

        if (status == 0) {
            // set user cookie
            res.cookie.user = sha1("wyc" + _username);
            console.log("msg[username]: " + msg["username"]);
        }
        else if(status == 1) {
            console.log("db errors");
        } else if (status == 2) {
            console.log("no users");
        } else {
            // no logic here
        }
        res.json({"status": status, "msg": msg});
    });
});

router.get('/', function (req, res) {
  res.send("remain to complete.");
});

module.exports = router;
