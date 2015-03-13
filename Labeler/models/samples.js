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
        // get the result parallel
        async.series([
            function() {
                that.getCountofSamplesByLabeled(keyword, function(status, msg){
                    r.push(msg['amount']);
                });
            },
            function() {
                that.getCountofSamplesByConflict(keyword, function(status, msg){
                    callback(null, msg['amount']);
                });
            },
            function() {
                that.getCountofSamplesByTrash(keyword, function(status, msg){
                    callback(null, msg['amount']);
                });
            },
            function() {
                that.getCountofSamplesByUnlabeled(keyword, function(status, msg){
                    callback(null, msg['amount']);
                });
            }
        ], function(err, results){
           if(err) {
               console.log("ERROR: getStatsofSamples");
               callback(2, "getStats error");
           }
           else {
               console.log("results");
               console.log(results);
               callback(0, results);
           }
        });
    };

    return {
        getCountofSamplesByLabeled: getCountofSamplesByLabeled,
        getCountofSamplesByConflict: getCountofSamplesByConflict,
        getCountofSamplesByTrash: getCountofSamplesByTrash,
        getCountofSamplesByUnlabeld: getCountofSamplesByTrash,
        getStatsofSamples: getStatsofSamples
    };
})();

module.exports = samples;
