'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CountersSchema = module.exports = new Schema({
  type: {
    type: String,
    index: true
  },
  count: {
    type: Number,
    index: true
  }
});

CountersSchema.statics.next = function (type, cb) {
  var query  = { type: type };
  var update = { $inc: { count: 1 } };
  var opts   = { upsert: true };
  this.findOneAndUpdate(query, update, opts, function (err, doc) {
    if (err) { return cb(err); }
    var count = doc ? doc.count : 1;
    cb(null, count);
  });
};

module.exports = mongoose.model('Counters', CountersSchema);