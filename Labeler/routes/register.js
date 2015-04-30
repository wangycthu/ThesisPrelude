/**
 * Created by wangyc on 15-2-25.
 */
var express = require('express');
// var User = require('./user');
var user = require("../models/user");
var router = express.Router();
var config = require("../config");
var sha1 = require("node-sha1");
var logger = require("../models/logger");

router.post('/', function (req, res) {
    var _username = req.body.userName;
    var _password = req.body.password;
    var _email = req.body.email;
    var _isSuper = false;
    user.register(_username, _email, _password, _isSuper, function(status, msg){

        if (status != 0) {
            res.json({"status":status, "msg": msg});
        }
        else {
            req.session.user = sha1(config.secure_proxy + _username);
            req.session.username = _username;
            logger.info([req.session.username, "has register!"]);
            res.json({"status":status, "msg": msg});
        }       
    });
    /*
    var user = new User(_userName, _email, _password, false);
    user.Register(function (status, msg) {

        if(status == 1) {
            // here 0 declare error.
            res.status(404).end();
        } else if (status == 2) {
            logger.info("register fail!");
            res.json({"status":status, "msg": msg});
        }

        req.session.user = sha1("undefined" + _userName);
        req.session.username = msg["username"];
        logger.info([req.session.username, "has register!"]);
        res.json({'status': status, 'msg': msg});
    });
*/
});

router.get('/', function (req, res) {
  res.send("remain to complete.");
});

module.exports = router;
