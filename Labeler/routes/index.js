var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    // check if has login
    if(res.cookie.user != undefined) {
        console.log(res.session.user);
        res.redirect("/label");
    } else {
        res.render('index', {title: '微博标注平台'});
    }
});

module.exports = router;
