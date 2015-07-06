'use strict';

var pluck = require('101/pluck');
var compose = require('101/compose');
var isFunction = require('101/is-function');
var keypather = require('keypather')();
var debug = require('auto-debug')();
require('string_score');
require('bind-right');
var gt = function (compare) {
  return function (val) {
    return val > compare;
  };
};

var BaseSchema = module.exports = {
  methods: {},
  statics: {}
};

BaseSchema.statics.findOneBy = function (key, val) {
  var query = {};
  query[key] = val;
  var args = Array.prototype.slice.call(arguments, 2);
  args.unshift(query);
  this.findOne.apply(this, args);
};

BaseSchema.statics.findBy = function (keypath, val /*, [fields], [options], cb */) {
  var query = {};
  query[keypath] = val;
  var args = Array.prototype.slice.call(arguments, 2);
  args.unshift(query);
  this.find.apply(this, args);
};

BaseSchema.statics.findOneDupe = function (data, cb) {
  var hash;
  if (data.hash) {
    hash = data.hash;
  }
  else {
    try {
      hash = this.generateHash(data);
    }
    catch (err) {
      return cb(err);
    }
  }

  this.findOneBy('hash', hash, cb);
};

BaseSchema.statics.findSimilar = function (data, fuzziness, cb) {
  var self = this;
  if (isFunction(fuzziness)) {
    cb = fuzziness;
    fuzziness = null;
  }
  if (data.zip === '00000') {
    var names = keypather.get(data, 'invite.mehta.names') ||
      keypather.get(data, 'invite.patel.names');
    this.find({
      $or: [
        { 'invite.mehta.names': { $in: names } },
        { 'invite.patel.names': { $in: names } }
      ],
      zip: '00000'
    }, function (err, similar) {
      if (err) { return cb(err); }
      if (similar.length === 0) {
        debug('00000 NONE SIMILAR?????');
        debug('00000 NONE SIMILAR?????');
        debug('00000 NONE SIMILAR?????');
      }
      else if (similar.length > 1) {
        debug('more than 1 similar?AA', data, similar);
      }
      cb(null, similar);
    });
    return;
  }

  this.find({}, { hash:1 }, function (err, documents) {
    if (err) { return cb(err); }
    fuzziness = fuzziness || 0.5;
    var score = data.hash.score.bindRight(data.hash, fuzziness);
    var withSimilarScores = [
      gt(0.6),
      score,
      pluck('hash') // first
    ].reduce(compose);
    var similar = documents
      .filter(withSimilarScores);
    if (similar.length === 0) {
      return cb(null, []);
    }
    else if (similar.length > 1) {
      console.log('more than 1 similar?', data, similar);
    }
    var similarIds = similar.map(pluck('_id'));
    self.findBy('_id', { $in: similarIds }, cb);
  });
};

BaseSchema.statics.findSimilarOrCreate = function (data, cb) {
  var self = this;
  this.findSimilar(data, function (err, similar) {
    if (err) { return cb(err); }
    if (similar.length > 1) {
      console.error('createIfNoneSimilar', 'TOO MANY SIMILAR!', similar);
    }
    if (similar[0]) {
      return cb(null, similar[0]);
    }
    debug('NONE SIMILAR?????');
    debug('NONE SIMILAR?????');
    debug('NONE SIMILAR?????');
    debug('NONE SIMILAR?????');
    debug(data);
    self.create(data, cb);
  });
};