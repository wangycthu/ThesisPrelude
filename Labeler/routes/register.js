/**
 * Created by wangyc on 15-2-25.
 */
var express = require('express');
var User = require('./user');
var router = express.Router();
var sha1 = require("node-sha1");
router.post('/', function (req, res) {
    var _userName = req.body.userName;
    var _password = req.body.password;
    var _email = req.body.email;
    var user = new User(_userName, _email, _password, false);
    user.Register(function (status, msg) {
        req.session.user = sha1("wyc" + _userName);
        req.session.username = msg["username"];
        res.json({'status': status, 'msg': msg});
    });
});

router.get('/', function (req, res) {
  res.send("remain to complete.");
});

module.exports = router;
