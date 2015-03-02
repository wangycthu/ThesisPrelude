/**
 * Created by wangyc on 15-2-25.
 */
var express = require('express');
var User = require('./user');
var router = express.Router();

router.post('/', function (req, res) {
  var _userName = req.body.userName;
  var _password = req.body.password;
  var user = new User(_userName, _password, false);
  user.Register(function (status, msg) {
    res.json({'status': status, 'msg': msg});
  });
});

router.get('/', function (req, res) {
  res.send("remain to complete.");
});

module.exports = router;

