"use strict";

const Class = require('uclass');
const guid  = require('mout/random/guid');
const forIn = require('mout/object/forIn');
const co    = require('co');


const EventEmitter = new Class({
  Binds : ['on', 'off', 'once', 'emit'],

  callbacks : {},

  initialize : function() {
    var self = this;

    this.addEvent = this.on;
    this.addListener = this.on;
    this.removeListener = this.off;
    this.removeAllListeners = this.off;
    this.fireEvent = this.emit;
  },

  

  emit:function(event, payload){
    if(!this.callbacks[event])
      return Promise.resolve();

    var chain = [];

    var args = Array.prototype.slice.call(arguments, 1);

    forIn(this.callbacks[event], function(callback) {
      var p = co.apply(callback.ctx, [callback.callback].concat(args));
      chain.push(p);
    });

    return Promise.all(chain);
  },



  on:function(event, callback, ctx){
    if(typeof callback != "function")
      return console.log("you try to register a non function in " , event)
    if(!this.callbacks[event])
      this.callbacks[event] = {};
    this.callbacks[event][guid()] = {callback, ctx};
  },

  once:function(event, callback, ctx){
    var self = this;
    var once = function(){
      self.off(event, once);
      self.off(event, callback);
    };

    this.on(event, callback, ctx);
    this.on(event, once);
  },

  off:function(event, callback){
    if(!event)
      this.callbacks = {};
    else if(!callback)
      this.callbacks[event] = {};
    else forIn(this.callbacks[event] || {}, function(v, k) {
      if(v.callback == callback)
        delete this.callbacks[event][k];
    }, this);
  },
});

module.exports = EventEmitter;