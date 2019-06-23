"use strict";

const winston = require("winston");

const config = require("../config");

// Log levels:
// { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
//
// Usage:
// log.verbose('blah')
// log.error('some error msg', new InstanceOfError())
module.exports = winston.createLogger({
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple(),
  ),
  transports: [
    new winston.transports.Console({
      level: config.logLevel,
      handleExceptions: true,
    }),
  ],
});
