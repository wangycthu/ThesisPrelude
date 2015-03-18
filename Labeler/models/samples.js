/**
 * Created by neutronest on 15-3-13
 */

var async = require("async");
var Set = require("collections/set");
var MysqlClient = require("../models/mysql");
var conn = MysqlClient.createConnection();

var samples = (function(){

    var that = this;


    /*
     * In the label page logic ===================================
     **/
    that.getSamplesByLabels = function(keyword, username, callback) {
        async.waterfall([
            function(callback) {

                MysqlClient.getCountofParentsByUser(keyword, username, function(status, msg){
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
                    MysqlClient.getSamplesIDRandomlyByUser(keyword, username, rdmLimit, function(status, rows){
                        if(status != 0) callback(null, "error");
                        else {
                            callback(null, rows[0]['id']);
                        }
                    });
                }
            },

            function(id, callback) {

                if(id === "error") callback(null, "error");
                else {
                    MysqlClient.getSamplesByIds(keyword, id, function(status, msg){
                        if(status != 0) callback(1, "error");
                        else callback(null, msg);
                    });
                }
            },

        ], function (err, result) {
            console.log("result");
            console.log(result);
            callback(0, result);
        });
    };

    /*
     * In the overview page logic ===================================
     **/
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

    /*
     * In the check page logic ===================================
     **/

    that.getSamplesByConflict = function(keyword, callback) {
        /*
         * This method is more complex.
         * First get all the conflict ids.
           Then store their mapping parent-ids with a set,
           keep the parent UNIQUE!
           then for each parent, get their thread.
         */
        MysqlClient.getIdsByConflict(keyword, function(status, msg){

            if (status != 0) callback(1, "error");
            else {
                //
                var conflictIds = msg;
                console.log(conflictIds);
                var parentIds = new Set();
                async.eachSeries(conflictIds, function(cid, callback){

                    MysqlClient.findParentIdByChild(keyword, cid, function(status, row){
                        if (status != 0) callback(1, "error");
                        else {
                            // get group id
                            parentIds.add(row["id"]);
                            callback(0, parentIds);
                        };
                    });
                }, function(err, results){

                    // result is parentIds
                    // get all the thread By parentIds
                    var parentIdsArray = Array.from(parentIds);
                    console.log("==============");
                    console.log(parentIdsArray);
                    if (parentIdsArray.length === 0) {
                        callback(0, []);
                    } else {
                        MysqlClient.getSamplesByIds(keyword, parentIdsArray, function(status, rows){
                            if (status != 0) callback(1, "error");
                            else callback(0, rows);
                        });
                    }
                });
            }
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
        getSamplesByConflict: getSamplesByConflict
    };
})();

module.exports = samples;
