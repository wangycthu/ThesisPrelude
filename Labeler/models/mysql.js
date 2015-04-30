var config = require("../config");
var mysql = require('mysql');
var logger = require("../models/logger");
// var mysql_conn = require("../models/mysql_conn");


var MysqlClient = (function() {

    var that = this;
    that.conn = null;
    that.pool = null;
    that.keywordList = {
        'iPhone6': 'iPhone6', 'MaYun': '马云',
        'Marriage': '结婚', 'Interstellar': '星际穿越',
        'BaBaQuNar': '爸爸去哪儿', 'DoubleEleven': '双十一',
        'DuJiaoShou': '都教授', 'Frozen': '冰雪奇缘',
        'RunningMan': '奔跑吧兄弟', 'WuMai': '雾霾',
        'XiaoLongNv': '小龙女'
    };

    that.createConnection = function () {

        var conn = mysql.createConnection({
            host: config.mysql_connect.host,
            port: config.mysql_connect.port,
            user: config.mysql_connect.user,
            password: config.mysql_connect.password,
            database: config.mysql_connect.database,
            charset: config.mysql_connect.charset
        });
        that.conn = conn;

        that.conn.connect(function(err){

            if(err) {
                logger.info("Connection error!");
                setTimeout(that.createConnection, 2000);
            }
        });

        that.conn.on("error", function(err){

            if(err.code === "PROTOCOL_CONNECTION_LOST") {
                that.createConnection();
            } else {
                logger.error("DB CONNECT ERROR!!!");
            }
        });

        return that.conn;
    };

    // DB operator
    that.getUserInfo = function(email, password, callback) {

        var _query = "SELECT * FROM UserInfo WHERE email = ? limit 1";
        that.conn.query(_query, [email], function(err, rows, fields) {
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
        });
    };

    that.getUser = function(username, callback) {
        var _query = "SELECT * FROM UserInfo WHERE username = ? ";
        that.conn.query(_query, [username], function(err, rows, fields){
            if(err) {
                logger.info("ERROR: getUser");
                callback(1, "db error");
            } else callback(0, rows[0]);
        });
    };

    that.insertUser = function (user) {

        var _query = "INSERT INTO UserInfo "
                + " values(?, ?, ?, default, default, defualt)";

        conn.query( _query, [user.username, user.password, user.isSuper],
                    function(err, res) {
                        if(err) {
                            logger.info("ERROR: insert into UserInfo error!");
                            callback(0, "save user error.");
                        }
                        callback(1, that);
                    });
    };

    // has labeled
    that.getCountofSamplesByLabeled = function(keyword, callback) {

        var _query = "SELECT COUNT(*) AS amount FROM ?? "
                + " WHERE ( (label1 IS NOT NULL ) AND (label2 IS NOT NULL) AND (label1 <> 2)"
                + " AND ( (label1 = label2) OR (valid IS NOT NULL) ) ) ";
        conn.query(_query, [keyword] ,function(err, rows, fields){

            if(err) {
                logger.info("ERROR: getCountofSamplesByLabeled");
                callback(1, "DB error");
            } else callback(0, rows[0]);

        });
    };

    that.getCountofSamplesByConflict = function(keyword, callback) {

        var _query = "SELECT COUNT(id) AS amount FROM ?? "
                + " WHERE ((label1 IS NOT NULL) AND (label2 IS NOT NULL) "
                + " AND (label1 != label2 ) AND (valid IS NULL ))";
        conn.query(_query, [keyword], function(err, rows, fields){
            if(err) {
                logger.info("ERROR: getCountofSamplesByConflict");
                callback(1, "DB error");
            } else callback(0, rows[0]);
        });
    };

    that.getCountofSamplesByUnlabeled = function(keyword, callback) {

        var _query = "SELECT COUNT(id) AS amount FROM ?? "
                + " WHERE ((label1 IS NULL) OR (label2 IS NULL))";
        conn.query(_query, [keyword], function(err, rows, fields){
            if(err) {
                logger.info("ERROR: getCountofSamplesByUnlabeled");
                callback(1, "DB error");
            } else {logger.info(rows);callback(0, rows[0]);}
        });
    };

    that.getCountofSamplesByTrash = function(keyword, callback) {
        var _query = "SELECT COUNT(id) AS amount FROM ?? "
                + " WHERE ((label1 = 2) OR (label2 = 2))";

        conn.query(_query, [keyword], function(err, rows, fields) {
            if(err) {

                logger.info("ERROR: getCountofSamplesByTrash");
                callback(1, "DB error");
            } else callback(0, rows[0]);
        });
    };

    that.getSamplesByUnlabeled = function(keyword, username, callback) {

        var _query = "SELECT * from ? "
                + " WHERE ((label1 <> ?) AND (label2 <> ?) AND "
                + " ((label1 <> NULL) OR (label2 <> NULL)))";
        conn.query(_query, [keyword, username, username],
                   function(err, rows, fields){
                       if (err) {
                           logger.info("ERROR: getSamplesByUnlabeled");
                           callback(1, "DB error");
                       } else callback(0, rows);
                   });
    };

    // get the parent samples
    that.getCountofParentsByUser = function(keyword, username, callback) {

        var _query = "SELECT COUNT(id) as amount FROM ?? "
                + " WHERE number = 0 AND ((label1 is NULL) "
                + " OR (user1 != ? AND label2 is NULL)) "
                + " AND (username != \'USERNAME\')";
        conn.query(_query, [keyword, username],
                   function(err, rows, fields){
                       if(err) {
                           logger.info(err);
                           callback(1, "DB error");
                       } else {
                           logger.info(rows);
                           callback(0, rows[0]);
                       }
                   });
    };

    that.getSamplesIDRandomlyByUser = function(keyword, username, rdmlimit, callback) {
        var _query = "SELECT id FROM ?? "
                + " WHERE number = 0 AND ((label1 is NULL)"
                + " OR (user1 != ? AND label2 is NULL)) "
                + " AND (username <> \'USERNAME\') limit ? , 1";
        conn.query(_query, [keyword, username, rdmlimit],
                   function(err, rows, fields){
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
    };

    that.getSamplesByIds = function(keyword, ids, callback){

        var _query = "SELECT * FROM ?? WHERE id in ( ? ) ";
        conn.query(_query, [keyword, ids],
                   function(err, rows, fields){
                       if(err) {
                           logger.info(err);
                           logger.info("ERROR: getSamplesByids");
                           callback(1, "DB error");
                       } else callback(0, rows);
                   });
    };

    that.getIdsByConflict = function(keyword, callback) {

        var _query = "SELECT id FROM ?? "
                + " WHERE ((label1 IS NOT NULL) "
                + "AND (label2 IS NOT NULL) "
                + " AND (label1 != label2 ) "
                + " AND (valid IS NULL))";
        conn.query(_query, [keyword],
                   function(err, rows, fields){
                       if(err) {
                           logger.info(err);
                           logger.info("ERROR: getIdsByConflict");
                           callback(1, "DB error");
                       } else callback (0, rows);
                   });
    };

    that.getCountofIdsByConflict = function(keyword, callback) {

        var _query = "SELECT count(id) as amount FROM ?? "
                + " WHERE ((label1 IS NOT NULL) "
                + " AND (label2 IS NOT NULL) "
                + " AND (label1 != label2 ) "
                + " AND (valid IS NULL))";

        conn.query(_query, [keyword],
                   function(err, rows, fields){
                       if(err) {
                           logger.info(err);
                           logger.info("ERROR: getCountofSamplesByConflict");
                           callback(1, "DB error");
                       } else callback (0, rows[0]);
                   });
    };

    that.findParentIdByChild = function(keyword, childId, callback) {

        var _query = "SELECT id FROM ?? WHERE id = ? AND number = 0 ";
        conn.query(_query, [keyword, childId],
                   function(err, rows, fields){

                       if(err) {
                           logger.info(err);
                           consolg.log("ERROR: findParentIdByChild");
                           callback(1, "DB error");
                       } else if(!rows.length) {
                           callback(2, "user not find");
                       } else callback(0, rows[0]);
                   });
    };

    that.updateValid = function(keyword, id, number, valid, callback) {

        var _query = "UPDATE ?? SET valid = ? "
                + " WHERE id = ? AND number = ? ";
        conn.query(_query, [keyword, valid, id, number],
                   function(err, rows, fields){
                       if(err) {

                           logger.info(["err", "ERROR: checkConflict"]);
                           callback(1, "DB error");
                       } else {

                           callback(0, "update success!");
                       }
                   });
    };

    that.getCountofValidByUser = function(keyword, username, callback) {

        var _query = "SELECT COUNT(id) as amount FROM ?? "
                + " WHERE (user1 = ? or user2 = ? ) "
                + " AND ( valid IS NOT NULL )";

        conn.query(_query, [keyword, username], function(err, rows, fields){
            if(err) {
                logger.info([err, "ERROR: getCountofValidByUser"]);
                callback(1, "DB ERROR");
            } else {

                callback(0, rows[0]);
            }
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

module.exports = MysqlClient;
