'use strict';

var mongoose = require('mongoose');
var async = require('async');
var last = require('101/last');

module.exports = {
  connect: connect,
  disconnect: disconnect,
  dropCollection: dropCollections,
  dropCollections: dropCollections
};

function connect (cb) {
  mongoose.connect('mongodb://localhost/tns_test', cb);
}

function disconnect (cb) {
  mongoose.connection.db.dropDatabase(function (err) {
    if (err) { return cb(err); }
    mongoose.disconnect(cb);
  });
}

function dropCollections () {
  var names = Array.prototype.slice.call(arguments);
  return function (cb) {
    var collections = mongoose.connection.collections;
    async.forEach(names, function (name, cb) {
      var collection = collections[name];
      if (collection) {
        collection.drop(cb);
      }
    }, cb);
  };
}