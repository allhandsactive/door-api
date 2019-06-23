"use strict";

const config = require("../config");

module.exports = {
  verify(token, done) {
    if (token === config.token) {
      done(null, true);
    } else {
      done(new Error("Not authenticated!"));
    }
  },
};
