/**
 * Created by neutronest on 15-3-13
 */

var async = require("async");
var Set = require("collections/set");
// var MysqlClient = require("../models/mysql");
//var conn = MysqlClient.createConnection();
var mysql_conn = require("../models/mysqlv2");
var logger = require("../models/logger");
var config = require("../config");

var samples = (function(){

    var that = this;
    /*
     * In the label page logic ===================================
     **/
    that.getSamplesByLabels = function(topicid, username, callback) {
        async.waterfall([
            function(callback) {

                mysql_conn.getCountofParentsByUser(topicid, username, function(status, msg){
                    if(status != 0) callback(null, "error");
                    else {

                        callback(null, msg['amount']);
                    }
                });
            },

            function(amount, callback) {
                if(amount === "error") {
                    callback(null, "error");
                }
                else {
                    // get random thread ids
                    var rdmLimit = Math.floor(Math.random() * amount);
                    mysql_conn.getSamplesIDRandomlyByUser(topicid, username, rdmLimit, function(status, rows){
                        if(status != 0) {
                          if (status === 2) {
                            callback(null, "no data");
                          } else {
                            callback(null, "error");
                          }
                        } else {
                            callback(null, rows[0]['threadid']);
                        }
                    });
                }
            },

            function(threadid, callback) {
                if(threadid === "no data") callback(null, "no data");
                else if(threadid === "error") callback(null, "error");
                else {
                    mysql_conn.getSamplesByGroupIds(topicid, threadid, function(status, msg){
                        if(status != 0) callback(1, "error");
                        else callback(null, msg);
                    });
                }
            },

        ], function (err, result) {
            if (result === "error") callback(1, result);
            else if (result == "no data") callback(2, result);
            else callback(0, result);
        });
    };

    /*
     * In the overview page logic ===================================
     **/
    that.getCountofSamplesByLabeled = function(topicid, callback) {

        mysql_conn.getCountofSamplesByLabeled(topicid, function(status, msg){
            callback(status, msg);
        });
    };

    that.getCountofSamplesByConflict = function(topicid, callback) {

        mysql_conn.getCountofSamplesByConflict(topicid, function(status, msg){
            callback(status, msg);
        });
    };

    that.getCountofSamplesByTrash = function(topicid, callback) {

        mysql_conn.getCountofSamplesByTrash(topicid, function(status, msg){
            callback(status, msg);
        });
    };

    that.getCountofSamplesByUnlabeled = function(topicid, callback) {

        mysql_conn.getCountofSamplesByUnlabeled(topicid, function(status, msg){
            callback(status, msg);
        });
    };

    that.getStatsofSamples = function(topicid, callback) {

        var r = [];
        // get the result parallel
        async.parallel([

            function(callback) {
                that.getCountofSamplesByLabeled(topicid, function(status, msg){
                    logger.info("labeled");
                    callback(null, msg["amount"]);
                });
            },
            function(callback) {
                that.getCountofSamplesByConflict(topicid, function(status, msg){
                    logger.info("conflict");
                    callback(null, msg["amount"]);

                });
            },
            function(callback) {
                that.getCountofSamplesByTrash(topicid, function(status, msg){
                    logger.info("trash");
                    callback(null, msg["amount"]);
                });
            },
            function(callback) {
                that.getCountofSamplesByUnlabeled(topicid, function(status, msg){
                    logger.info("unlabeled");
                    callback(null, msg["amount"]);
                });
            }],function(err, results) {

                logger.info(results);
                callback(0, results);
            }
               );
    };

    /*
     * In the check page logic ===================================
     **/

    that.getCountofIdsByConflict = function(topicid, callback) {

        mysql_conn.getCountofIdsByConflict(topicid, function(status, row){

            if (status != 0) callback(1, "error");
            else callback(0, row['amount']);
        });
    };

    that.getSamplesByConflict = function(topicid, callback) {
        /*
         * This method is more complex.
         * First get all the conflict ids, that is group ids.
           keep the groupIds into a set to keep unique
           then for each group id, get their thread.
         */
        mysql_conn.getIdsByConflict(topicid, function(status, msg){

            if (status != 0) callback(1, "error");
            else {
                // the conflictIds are just group ids

                // transfer
                var conflictIds = [];
                for(var i=0; i<msg.length; i++) {
                    conflictIds.push(msg[i]['threadid']);
                }
                logger.info(conflictIds);
                // then change to the set
                var parentIds = new Set();
                for (var j=0; j<conflictIds.length; j++) {
                    parentIds.add(conflictIds[j]);
                }
                var parentIdsArray = Array.from(parentIds);
                logger.info(parentIdsArray);
                if (parentIdsArray.length === 0) {
                    callback(0, []);
                } else {
                    // get one parent Id every time
                    mysql_conn.getSamplesByIds(topicid, parentIdsArray[0], function(status, rows){
                        if (status != 0) callback(1, "error");
                        else callback(0, rows);
                    });
                }
            }
        });
    };

    that.checkConflict = function(topicid, threadid, username, _labels, callback) {
        var labels = JSON.parse(_labels);
        logger.info(["labels: ", labels]);
        for (var number in labels) {
            logger.info("number:", number);
            var valid = null;
            switch (labels[number]) {
            case 'positive':
                valid = 1;
                break;
            case 'neutral':
                valid = 0;
                break;
            case 'negative':
                valid = -1;
                break;
            default:
                valid = "NULL";
            }

            // upate database
            mysql_conn.updateValid(topicid, threadid, number, valid, function(status, msg){
                logger.info(["upateValid", status, msg]);
            });
        }
        callback(0, "success");
    };

    that.updateUserValidCount = function(username, callback) {

        var keywordList = config.keywordList;
        var validNumber = 0;

        async.eachSeries(keywordList, function(topicid, next){

            mysql_conn.getCountofValidByUser(topicid, username, function(status, msg){
                if (status != 0) callback(status, msg);
                validNumber = validNumber + msg['amount'];
            });
        }, function(err){

            if(err) {
                logger.info("updateUserValidCount: error");
                callback(1, "error");
            } else callback(0, validNumber);
        });
    };

    return {
        // stats
        getCountofSamplesByLabeled: getCountofSamplesByLabeled,
        getCountofSamplesByConflict: getCountofSamplesByConflict,
        getCountofSamplesByTrash: getCountofSamplesByTrash,
        getCountofSamplesByUnlabeld: getCountofSamplesByUnlabeled,
        // label
        getStatsofSamples: getStatsofSamples,
        getSamplesByLabels: getSamplesByLabels,
        // check
        getSamplesByConflict: getSamplesByConflict,
        getCountofIdsByConflict: getCountofIdsByConflict,
        checkConflict: checkConflict,
        updateUserValidCount: updateUserValidCount
    };
})();

module.exports = samples;
