"use strict";

const chai = require("chai");
const request = require("supertest");

const app = require("../index");
const config = require("../config");

chai.should();

describe("/user", () => {
  it("should fail with a bad token", done => {
    request(app)
      .get("/user")
      .query({ access_token: "nope" })
      .expect(401, done);
  });

  it("should succeed with a good token", done => {
    request(app)
      .get("/user")
      .query({ access_token: config.token })
      .expect(200, done);
  });

  it("should provide a list of card IDs", done => {
    request(app)
      .get("/user")
      .query({ access_token: config.token })
      .expect(200)
      .expect("Content-Type", /^application\/json/)
      .end((err, res) => {
        if (err) {
          done(err);
          return;
        }

        res.body.should.be.an("array");
        res.body.forEach(item => {
          item.should.be.a("string");
        });

        done();
      });
  });
});
