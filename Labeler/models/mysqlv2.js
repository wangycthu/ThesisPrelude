var config = require("../config");
var mysql = require('mysql');
var logger = require("../models/logger");

var MysqlClient = (function() {


    var that = this;
    that.pool = null;

    that.createPool = function() {

        that.pool =  mysql.createPool({

            host: config.mysql_connect.host,
            port: config.mysql_connect.port,
            user: config.mysql_connect.user,
            password: config.mysql_connect.password,
            database: config.mysql_connect.database,
            charset: config.mysql_connect.charset,
            connectionLimit: 200
        });
    };


    // DB operator
    that.getUserInfo = function(email, password, callback) {

        that.pool.getConnection(function(err, connection){

            var _query = "SELECT * FROM UserInfo WHERE email = ? limit 1";
            connection.query(_query, [email], function(err, rows, fields) {
                if(err) {
                    logger.info("err: " + err);
                    callback(1, "db error");
                } else if(rows.length == 1){
                    if (rows[0]['password'] === password) {
                        callback(0, rows[0]);
                    } else {
                        callback(3, 'password error.');
                    }
                } else {
                    logger.info("err: " + "no user");
                    callback(2, "no user");
                }

                connection.release();
            });

        });
    };

    that.getUser = function(username, callback) {

        that.pool.getConnection(function(err, connection){
            var _query = "SELECT * FROM UserInfo WHERE username = ? ";
            connection.query(_query, [username], function(err, rows, fields){
                if(err) {
                    logger.info("ERROR: getUser");
                    callback(1, "db error");
                } else callback(0, rows[0]);
                connection.release();
            });
        });
    };

    that.insertUser = function (user) {

        that.pool.getConnection(function(err, connection){

            var _query = "INSERT INTO UserInfo "
                    + " values(?, ?, ?, default, default, defualt)";
            connection.query( _query,
                              [user.username, user.password, user.isSuper],
                              function(err, res) {
                                  if(err) {
                                      logger.info("ERROR: insert into UserInfo error!");
                                      callback(0, "save user error.");
                                  }
                                  callback(1, that);
                                  connection.release();
                              });
        });
    };

    that.getCountofSamplesByLabeled = function(topicid, callback) {

        that.pool.getConnection(function(err, connection){
            var _query = "SELECT COUNT(*) AS amount FROM weibo "
                    + " WHERE ( (topicid = ?) AND (label1 IS NOT NULL ) AND (label2 IS NOT NULL) AND (label1 <> 2)"
                    + " AND ( (label1 = label2) OR (valid IS NOT NULL) ) ) ";
            connection.query(_query, [topicid] ,function(err, rows, fields){
                connection.release();
                if(err) {
                    logger.info("ERROR: getCountofSamplesByLabeled");
                    callback(1, "DB error");
                } else callback(0, rows[0]);
            });

        });
    };


    that.getCountofSamplesByConflict = function(topicid, callback) {

        that.pool.getConnection(function(err, connection){

            var _query = "SELECT COUNT(id) AS amount FROM weibo "
                    + " WHERE ( (topicid = ? ) "
                    + " AND (label1 IS NOT NULL) AND (label2 IS NOT NULL) "
                    + " AND (label1 != label2 ) AND (valid IS NULL ))";
            connection.query(_query, [topicid], function(err, rows, fields){
                connection.release();
                if(err) {
                    logger.info("ERROR: getCountofSamplesByConflict");
                    callback(1, "DB error");
                } else callback(0, rows[0]);
            });
        });
    };

    that.getCountofSamplesByUnlabeled = function(topicid, callback) {

        that.pool.getConnection(function(err, connection){

            var _query = "SELECT COUNT(id) AS amount FROM weibo "
                    + " WHERE ( (topicid = ? ) "
                    + " AND ((label1 IS NULL) OR (label2 IS NULL)))";
            connection.query(_query, [topicid], function(err, rows, fields){
                connection.release();
                if(err) {
                    logger.info("ERROR: getCountofSamplesByUnlabeled");
                    callback(1, "DB error");
                } else {logger.info(rows);callback(0, rows[0]);}
            });
        });
    };

    that.getCountofSamplesByTrash = function(topicid, callback) {

        that.pool.getConnection(function(err, connection){
            var _query = "SELECT COUNT(id) AS amount FROM weibo "
                    + " WHERE ((topicid = ? ) "
                    + "AND  ((label1 = 2) OR (label2 = 2)))";

            connection.query(_query, [topicid], function(err, rows, fields) {
                connection.release();
                if(err) {
                    logger.info("ERROR: getCountofSamplesByTrash");
                    callback(1, "DB error");
                } else callback(0, rows[0]);
            });
        });
    };

    that.getSamplesByUnlabeled = function(topicid, username, callback) {

        that.pool.getConnection(function(err, connection){
            var _query = "SELECT * FROM weibo "
                    + " WHERE ( (topicid = ? ) "
                    + " AND (label1 <> ?) AND (label2 <> ?) AND "
                    + " ((label1 <> NULL) OR (label2 <> NULL)))";
            connection.query(_query, [topicid, username, username],
                       function(err, rows, fields){
                           connection.release();
                           if (err) {
                               logger.info("ERROR: getSamplesByUnlabeled");
                               callback(1, "DB error");
                           } else callback(0, rows);
                       });
        });
     };

    // get the parent samples
    that.getCountofParentsByUser = function(topicid, username, callback) {
        that.pool.getConnection(function(err, connection){

            var _query = "SELECT COUNT(id) as amount FROM weibo "
                    + " WHERE topicid = ? "
                    + " AND number = 0 AND ((label1 is NULL) "
                    + " OR (user1 != ? AND label2 is NULL)) "
                    + " AND (username != \'USERNAME\')";
            connection.query(_query, [topicid, username],
                       function(err, rows, fields){
                           connection.release();
                           if(err) {
                               logger.info(err);
                               callback(1, "DB error");
                           } else {
                               logger.info(rows);
                               callback(0, rows[0]);
                           }
                       });
        });
    };

    that.getSamplesIDRandomlyByUser = function(topicid, username, rdmlimit, callback) {

        that.pool.getConnection(function(err, connection){

            var _query = "SELECT id FROM weibo "
                    + " WHERE topicid = ? AND number = 0 "
                    + " AND ((label1 is NULL) "
                    + " OR (user1 != ? AND label2 is NULL)) "
                    + " AND (username <> \'USERNAME\') limit ? , 1";
            connection.query(_query, [topicid, username, rdmlimit],
                       function(err, rows, fields){
                           connection.release();
                           if(err) {
                               logger.info(err);
                               callback(1, "DB error");
                           } else {
                               if (rows.length === 0) {
                                   callback(2, "no data");
                               } else {
                                   callback(0, rows);
                               }
                           }
                       });
        });
    };

    that.getSamplesByIds = function(topicid, ids, callback){

        that.pool.getConnection(function(err, connection){

            var _query = "SELECT * FROM weibo WHERE topicid = ? "
                    + " AND id in ( ? ) ";
            connection.query(_query, [topicid, ids],
                       function(err, rows, fields){
                           connection.release();
                           if(err) {
                               logger.info(err);
                               logger.info("ERROR: getSamplesByids");
                               callback(1, "DB error");
                           } else callback(0, rows);
                       });
        });
    };

    that.getIdsByConflict = function(topicid, callback) {

        that.pool.getConnection(function(err, connection){

            var _query = "SELECT id FROM weibo "
                    + " WHERE ( topicid = ? "
                    + " AND (label1 IS NOT NULL) "
                    + "AND (label2 IS NOT NULL) "
                    + " AND (label1 != label2 ) "
                    + " AND (valid IS NULL))";
            connection.query(_query, [topicid],
                       function(err, rows, fields){
                           connection.release();
                           if(err) {
                               Logger.info(err);
                               logger.info("ERROR: getIdsByConflict");
                               callback(1, "DB error");
                           } else callback (0, rows);
                       });
        });
    };

    that.getCountofIdsByConflict = function(topicid, callback) {

        that.pool.getConnection(function(err, connection){

            var _query = "SELECT count(id) as amount FROM weibo "
                    + " WHERE ( topicid = ? "
                    + " AND (label1 IS NOT NULL) "
                    + " AND (label2 IS NOT NULL) "
                    + " AND (label1 != label2 ) "
                    + " AND (valid IS NULL))";

            connection.query(_query, [topicid],
                       function(err, rows, fields){
                           connection.release();
                           if(err) {
                               logger.info(err);
                               logger.info("ERROR: getCountofSamplesByConflict");
                               callback(1, "DB error");
                           } else callback (0, rows[0]);
                       });
        });
    };

    that.findParentIdByChild = function(topicid, childId, callback) {

        that.pool.getConnection(function(err, connection){
            var _query = "SELECT id FROM weibo WHERE "
                    +  " topicid = ? AND id = ? AND number = 0 ";
            connection.query(_query, [topicid, childId],
                       function(err, rows, fields){
                           connection.release();
                           if(err) {
                               logger.info(err);
                               console.log("ERROR: findParentIdByChild");
                               callback(1, "DB error");
                           } else if(!rows.length) {
                               callback(2, "user not find");
                           } else callback(0, rows[0]);
                       });
        });
    };

    that.updateValid = function(topicid, groupid, number, valid, callback) {

        that.pool.getConnection(function(err, connection){

            var _query = "UPDATE weibo SET valid = ? "
                    + " WHERE topicid = ? "
                    + " AND groupid = ? AND number = ? ";
            connection.query(_query, [topicid, valid, groupid, number],
                       function(err, rows, fields){
                           connection.release();
                           if(err) {
                               logger.info(["err", "ERROR: checkConflict"]);
                               callback(1, "DB error");
                           } else {

                               callback(0, "update success!");
                           }
                       });
        });
    };

    that.getCountofValidByUser = function(topicid, username, callback) {

        that.pool.getConnection(function(err, connection){

            var _query = "SELECT COUNT(id) as amount FROM weibo "
                    + " WHERE topicid = ? AND "
                    + " (user1 = ? or user2 = ? ) "
                    + " AND ( valid IS NOT NULL )";

            connection.query(_query, [topicid, username], function(err, rows, fields){
                connection.release();
                if(err) {
                    logger.info([err, "ERROR: getCountofValidByUser"]);
                    callback(1, "DB ERROR");
                } else {
                    callback(0, rows[0]);
                }
            });
        });
    };

    return {
        createConnection: createConnection,
        getUserInfo: getUserInfo,
        getUser: getUser,
        getCountofSamplesByLabeled: getCountofSamplesByLabeled,
        getCountofSamplesByConflict: getCountofSamplesByConflict,
        getCountofSamplesByUnlabeled: getCountofSamplesByUnlabeled,
        getCountofSamplesByTrash: getCountofSamplesByTrash,
        getCountofParentsByUser: getCountofParentsByUser,
        getSamplesIDRandomlyByUser: getSamplesIDRandomlyByUser,
        getSamplesByIds: getSamplesByIds,
        getIdsByConflict: getIdsByConflict,
        getCountofIdsByConflict: getCountofIdsByConflict,
        findParentIdByChild: findParentIdByChild,
        updateValid: updateValid,
        getCountofValidByUser: getCountofValidByUser
    };
})();
