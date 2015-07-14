'use strict';
var assert = require('power-assert');
var jsdom  = require('mocha-jsdom');
var SDB    = require('../dist/simple-drawing-board-node');

describe('#SDB', function() {
  jsdom();

  it('constructor', function() {
    var div    = document.createElement('div');
    var canvas = document.createElement('canvas');

    console.log('-------------------');
    console.log(canvas);
    console.log('-------------------');
    console.log(canvas.getContext('2d'));
    console.log('-------------------');
    console.log(canvas.toDataURL());
    console.log('-------------------');

    assert.throws(function() { new SDB(div); });
    assert.doesNotThrow(function() { new SDB(canvas); });
  });

});
