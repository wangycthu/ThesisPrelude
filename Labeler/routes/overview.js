/**
 * Created by wangyc on 15-3-9.
 */
var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var conn = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '199283155wyc',
  database: 'Microblog',
  charset: 'UTF8MB4'
});

router.get('/', function (req, res, next) {

});
