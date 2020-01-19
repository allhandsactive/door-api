"use strict";

const express = require("express");
const expressWinston = require("express-winston");
const fs = require("fs");
const helmet = require("helmet");
const npid = require("npid");
const passport = require("passport");
const passportHttpBearer = require("passport-http-bearer");
const path = require("path");

const auth = require("./helpers/auth");
const config = require("./config");
const log = require("./helpers/log");

const app = express();
const { version } = JSON.parse(
  fs.readFileSync(path.join(__dirname, "package.json"), "utf8"),
);

// trust x-forwarded headers (since we'll always be using a reverse proxy)
app.enable("trust proxy");

// log requests
app.use(
  expressWinston.logger({
    winstonInstance: log,
    level: "info",
  }),
);

// security/caching
app.use(
  helmet({
    noCache: true,
  }),
);

// configure authentication
passport.use("token", new passportHttpBearer.Strategy(auth.verify));
app.use(passport.initialize());

// TODO: routes go here!

if (!module.parent) {
  // set up error handling
  process.on("uncaughtException", err => {
    log.error("Uncaught exception!", err);
    process.exit(1);
  });

  process.on("unhandledRejection", err => {
    log.error("Uncaught promise rejection!", err);
    process.exit(1);
  });

  // handle shutdown requests gracefully
  process.on("SIGTERM", () => {
    log.info("Received SIGTERM, shutting down.");
    process.exit(0);
  });

  process.on("SIGINT", () => {
    log.info("Received SIGINT, shutting down.");
    process.exit(0);
  });

  // if we're run directly, start up the server
  const server = app.listen(config.port, config.host, () => {
    const { port, address: host } = server.address();

    log.info(
      "Door API v%s (%s) listening at http://%s:%s (Node.js %s)",
      version,
      config.nodeEnv,
      host,
      port,
      process.version,
    );

    // drop the pid file if defined
    if (config.pidfile) {
      npid.create(config.pidfile).removeOnExit();
    }
  });
} else {
  // if someone else imports us, just expose the app
  // we're probably being run by mocha for integration tests
  module.exports = app;
}
