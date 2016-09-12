eventemitter with generator support (through co). [eventemitter-co](https://github.com/131/eventemitter-co) mimics `require('events').EventEmitter` API.

# API
```
var sleep = require('nyks/function/sleep');

var Event = require('eventemitter-co');
var event = new Event();

var cafe = {color:'black'};
event.on("start", function*() {
  yield sleep(1);
  console.log("Hi, coffee is ", this.color);
}, cafe);


event.emit("start");
```

# Errors (&promises)
event.emit() will return a promise you can work with if you need [to handle errors](https://github.com/131/eventemitter-co/blob/master/test/errors.js)



# Notes
You can set an optional 3rd parameter and set the context ("this") in event registration.

# See also

* [uclass](https://github.com/131/uclass) a pure JS/browser compliant class design syntax (ES6 classes with bindings)


# Credits
* [131](https://github.com/131);

# Keywords / shout box
events, eventemitter2, uclass, co, generators, promise, binding


[![Build Status](https://travis-ci.org/131/eventemitter-co.svg?branch=master)](https://travis-ci.org/131/eventemitter-co)
[![Coverage Status](https://coveralls.io/repos/github/131/eventemitter-co/badge.svg?branch=master)](https://coveralls.io/github/131/eventemitter-co?branch=master)