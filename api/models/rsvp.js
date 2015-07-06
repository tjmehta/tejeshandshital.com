'use strict';

var assign = require('101/assign');
var mongoose = require('mongoose');
require('string_score');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Events = {
  mehndi : Boolean,
  pithi  : Boolean,
  garba  : Boolean,
  wedding: Boolean,
  reception: Boolean
};

var RSVPSchema = new Schema({
  rsvps: [{
    name: String,
    events: Events
  }],
  address: {
    type: ObjectId,
    ref: 'Address',
    index: { sparse: true, unique: true }
  }
});

assign(RSVPSchema.statics, require('./base').statics);
assign(RSVPSchema.methods, require('./base').methods);


module.exports = mongoose.model('rsvps', RSVPSchema);