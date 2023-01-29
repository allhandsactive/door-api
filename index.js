"use strict";

const express = require("express");
const expressWinston = require("express-winston");
const fs = require("fs");
const helmet = require("helmet");
const nocache = require("nocache");
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

// security
app.use(helmet());

// don't cache responses
app.use(nocache());

// configure authentication
passport.use("token", new passportHttpBearer.Strategy(auth.verify));
app.use(passport.initialize());

app.get(
  "/user/count",
  passport.authenticate("token", { session: false }),
  (req, res) => {
    // TODO: get an actual number from sqlite
    res.json(4);
  },
);

app.get(
  "/user/updated",
  passport.authenticate("token", { session: false }),
  (req, res) => {
    res.json(new Date().getTime());
  },
);

app.get(
  "/user",
  passport.authenticate("token", { session: false }),
  (req, res) => {
    // TODO: get an actual list from sqlite
    res.json(["01020304", "05060708", "09101112", "13141516"]);
  },
);

app.get(
  "/time",
  passport.authenticate("token", { session: false }),
  (req, res) => {
    res.json(new Date().getTime());
  },
);

if (!module.parent) {
  // set up error handling
  process.on("uncaughtException", (err) => {
    log.error("Uncaught exception!", err);
    process.exit(1);
  });

  process.on("unhandledRejection", (err) => {
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
