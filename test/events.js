"use strict";
/* eslint-env node, mocha */

const expect = require('expect.js');

const Events = require('../');

class Time extends Events {
  constructor() {
    super();
    this.foo = 'bar';
  }
}

describe("events testing", function() {

  it("should fire every time", function() {
    var time = new Time(8, 55);
    var a    = 0;
    var inc  = function() {
      a += 1;
    };

    time.on("fooa", inc);
    time.emit("fooa");
    time.emit("this is an unknown event with no effect");
    time.off("this is an unknown event with no effect");

    expect(a).to.be(1);
    time.emit("fooa");
    expect(a).to.be(2);
  });

  it("should be well binded", function() {
    var time = new Time(8, 55);
    var a    = 0;
    var inc  = function() {
      a += 1;
    };
    var c    = {on : time.on, emit : time.emit};

    c.on("fooa", inc);
    c.emit("fooa");

    expect(a).to.be(1);
    c.emit("fooa");
    expect(a).to.be(2);
  });

  it("should test emit with arsg", function() {
    var time = new Time(8, 55);
    var a    = 0;
    var b    = 0;
    var inc  = function (c, d) {
      a += c - d;
    };
    var inc2 = function (c, d) {
      b += c - d;
    };

    time.on("fooa", inc2);
    time.on("fooa", inc);

    time.emit("fooa", 8, 6);

    expect(a).to.be(2);
    expect(b).to.be(2);
  });

  it("should allow multiple subscriptions", function() {
    var time = new Time(8, 55);
    var b    = 0;
    var a    = 0;
    var ainc = function() {
      a += 1;
    };
    var binc = function() {
      b += 1;
    };

    time.once("foo", ainc);
    time.on("foo", binc);

    time.emit("foo");
    expect(a).to.be(1);
    expect(b).to.be(1);

    time.off("foo", binc);

    time.emit("foo");
    expect(a).to.be(1);
    expect(b).to.be(1);
  });

  it("should not bother unsubscribe unknow events", function() {
    var time = new Time(8, 55);
    var inc  = function() {};
    time.off("foo", inc);
    time.off("fooa");
  });

  it("should support complex mixing once & on", function() {
    var time = new Time(8, 55);
    var b    = 0;
    var a    = 0;
    var ainc = function() {
      a += 1;
    };
    var binc = function() {
      b += 1;
    };

    time.on("foo", ainc);
    time.on("foo", binc);

    time.emit("foo");
    expect(a).to.be(1);
    expect(b).to.be(1);

    time.off("foo", ainc);
    time.emit("foo");
    expect(a).to.be(1);
    expect(b).to.be(2);

    time.off("foo", ainc);
    time.off("foo"); //remove binc

    time.emit("foo");
    expect(a).to.be(1);
    expect(b).to.be(2);
  });

  it("should remove all events", function() {
    var time = new Time(8, 55);
    var b    = 0;
    var a    = 0;
    var ainc = function() {
      a += 1;
    };
    var binc = function() {
      b += 1;
    };

    time.on("foo", ainc);
    time.on("foo", binc);

    time.off(); //remove all

    time.emit("foo");
    expect(a).to.be(0);
    expect(b).to.be(0);
  });

  it("should not register a no function events", function() {
    var time = new Time();
    time.on("testEvent", 5);
    time.on("testEvent", {});

    expect(time.callbacks).to.eql({});
  });

});

class Clock extends Time {
  constructor() {
    super();
    this.bar = this.bar.bind(this);
  }
  bar() {
    return this.foo; //bar from Time
  }
}

describe("derivated event testing", function() {

  it("should fire every time", function() {
    var time = new Clock(8, 55);
    var a    = 0;
    var inc  = function() {
      a += 1;
    };
    time.on("fooa", inc);
    time.emit("fooa");

    expect(a).to.be(1);
    time.emit("fooa");
    expect(a).to.be(2);
  });

  it("should be well binded", function() {
    var time = new Clock(8, 55);
    expect(time.bar()).to.be('bar');
    var a   = 0;
    var inc = function() {
      a += 1;
    };
    var c = {on : time.on, emit : time.emit};
    c.on("fooa", inc);
    c.emit("fooa");

    expect(a).to.be(1);
    c.emit("fooa");
    expect(a).to.be(2);
  });

});
