/**
 Creatd by neutronest on 15-4-29
 */
var async = require("async");
var mysql_conn = require("../models/mysqlv2");
var logger = require("../models/logger");
var config = require("../config");

var thread = (function(){

    var that = this;

    that.save = function(threadid, topicid, username, labels, ifrelated, callback) {

        logger.info("thread getThreadParent");
        mysql_conn.getThreadParent(threadid, topicid, function(status, rows){

            if (status == 1) callback(1, "error on getThreadParent");
            if (!rows.length) {

                logger.info("no item");
                callback(2, "no item");
            }
            logger.info(["parent rows:", rows]);
            var row = rows[0];
            var order = '1';
            if (row['user1'] != null && row['user1'] != username) {
                order = '2';
            }
            logger.info(["order: ", order]);
            logger.info(["labels: ", labels]);

            labels = JSON.parse(labels);
            for (var number in labels) {
                var label = null;
                switch (labels[number]) {
                case "positive":
                    label = 1;
                    break;
                case "neutral":
                    label = 0;
                    break;
                case "negative":
                    label = -1;
                    break;
                default:
                    label = "NULL";
                }

                logger.info("update thread");
                logger.info(['label:', label]);
                mysql_conn.updateThread(threadid, topicid, number, label, username, order, ifrelated, function(status, res){
                    if(status != 0) {
                        callback(status, "update failed!");
                    }
                });
            };
            mysql_conn.updateUserWork(username, function(status, msg){
                        callback(status, msg);
            });
        });
    };

    that.trash = function(threadid, topicid, callback){
        mysql_conn.updateThreadByTrash(threadid, topicid, function(status, msg){
            callback(status, msg);
        });
    };


    return {
        save: save,
        trash: trash
    };
})();

module.exports = thread;
