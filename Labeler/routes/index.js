var express = require('express');
var router = express.Router();
var session = require("express-session");
/* GET home page. */
router.get('/', function(req, res, next) {

    // check if has login
    if(req.session.user != undefined) {
        console.log(req.session.user);
        if (req.session.isSuper != undefined) {
            res.redirect("/overview");
        } else {
            res.redirect("/label");
        }
    } else {
        res.render('index', {title: '微博标注平台'});
    }
});

module.exports = router;
