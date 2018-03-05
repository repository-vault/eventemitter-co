"use strict";
/* eslint-env node, mocha */

const co     = require('co');

const detach = require('nyks/function/detach');

const Events = require('../');

function cothrow(generator) {
  co(generator).catch(detach(function(error) {
    console.log("INER ERROR", error);
    throw error;
  }));
}


describe("events testing", function() {

  it("should test stuff", function(done) {
    function next(what) {
      next[what] = true;
      if(next["continue"] && next["error"])
        done();
    }

    cothrow(function() {

      var i = new Events();

      i.on("error", function() {
        throw new Error("This is an error");
      });

      i.emit("error").catch(function() {
        next("error");
      });

      next("continue");

    });
  });

});
