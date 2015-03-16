/**
 * Created by neutronest on 15-3-13
 */

var async = require("async");
var MysqlClient = require("../models/mysql");
var conn = MysqlClient.createConnection();

var samples = (function(){

    var that = this;

    that.getCountofSamplesByLabeled = function(keyword, callback) {

        MysqlClient.getCountofSamplesByLabeled(keyword, function(status, msg){
            callback(status, msg);
        });
    };

    that.getCountofSamplesByConflict = function(keyword, callback) {

        MysqlClient.getCountofSamplesByConflict(keyword, function(status, msg){
            callback(status, msg);
        });
    };

    that.getCountofSamplesByTrash = function(keyword, callback) {

        MysqlClient.getCountofSamplesByTrash(keyword, function(status, msg){
            callback(status, msg);
        });
    };

    that.getCountofSamplesByUnlabeled = function(keyword, callback) {

        MysqlClient.getCountofSamplesByUnlabeled(keyword, function(status, msg){
            callback(status, msg);
        });
    };

    that.getStatsofSamples = function(keyword, callback) {

        var r = [];
        /**
        var tasks = ["getCountofSamplesByLabeled",
                     "getCountofSamplesByConflict",
                     "getCountofSamplesByTrash",
                     "getCountofSamplesByUnlabel"];
        async.eachSeries(tasks, function(item, callback){
            // item is just ecah element in tasks
            that.apply(item, [keyword, function(status, msg){
                r.push(msg["amount"]);
            }]);

        });
        console.log(r);
        return r;
         **/
        // get the result parallel
        async.parallel([

            function(callback) {
                that.getCountofSamplesByLabeled(keyword, function(status, msg){
                    console.log("labeled");
                    callback(null, msg["amount"]);
                });
            },
            function(callback) {
                that.getCountofSamplesByConflict(keyword, function(status, msg){
                    console.log("conflict");
                    callback(null, msg["amount"]);

                });
            },
            function(callback) {
                that.getCountofSamplesByTrash(keyword, function(status, msg){
                    console.log("trash");
                    callback(null, msg["amount"]);
                });
            },
            function(callback) {
                that.getCountofSamplesByUnlabeled(keyword, function(status, msg){
                    console.log("unlabeled");
                    callback(null, msg["amount"]);
                });
            }],function(err, results) {

                console.log(results);
                callback(0, results);
            }
               );
    };

    return {
        getCountofSamplesByLabeled: getCountofSamplesByLabeled,
        getCountofSamplesByConflict: getCountofSamplesByConflict,
        getCountofSamplesByTrash: getCountofSamplesByTrash,
        getCountofSamplesByUnlabeld: getCountofSamplesByUnlabeled,
        getStatsofSamples: getStatsofSamples
    };
})();

module.exports = samples;
