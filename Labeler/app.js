var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");
// var logger = require("morgan");
var fs = require("fs");
// All routes define
var routes = require('./routes/index');
var labels = require('./routes/label');
var login = require('./routes/login');
var register = require('./routes/register');
var overview = require('./routes/overview');
var check = require("./routes/check");
var logout = require("./routes/logout");

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: "wyc"}));

// add views
app.use('/', routes);
app.use('/index', routes);
app.use('/label', labels);
app.use('/login', login);
app.use('/register', register);
app.use('/overview', overview);
app.use('/check', check);
app.use('/logout', logout);
// catch 404 and forward to error handler
/*
app.use(function(err, req, res, next) {
    res.status(500).send("Some error happened!");
});
*/


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
