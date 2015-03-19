var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    // check if has login
    if(res.cookie.username != undefined) {
        console.log(res.cookie.user);
        res.redirect("/label");
    } else {
        res.render('index', {title: '微博标注平台'});
    }
});

module.exports = router;
