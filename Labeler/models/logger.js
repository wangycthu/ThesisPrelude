var winston = require("winston");
var config = require("../config");
var logger = new (winston.Logger) ({

    transports : [
        new (winston.transports.Console)({ json: false, timestamp: true }),
        new winston.transports.File({ filename: config.logger_file, json: false })
    ],
    exceptionHandlers: [
        new (winston.transports.Console)({ json: false, timestamp: true }),
        new winston.transports.File({ filename: config.logger_exceptions_file, json: false })
    ],
    exitOnError: false,
    level: "debug"
});

module.exports = logger;
