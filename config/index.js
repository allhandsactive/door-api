"use strict";

let logLevel;
const nodeEnv = process.env.NODE_ENV || "development";

if (nodeEnv === "production") {
  logLevel = "info";
} else if (nodeEnv === "test") {
  logLevel = "warn";
} else {
  logLevel = "silly";
}

module.exports = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || "127.0.0.1",
  pidfile: process.env.PIDFILE || null,

  nodeEnv,
  logLevel,

  token: process.env.TOKEN || "insecure",
};
