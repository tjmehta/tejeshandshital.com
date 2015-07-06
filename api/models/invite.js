'use strict';

var assign = require('101/assign');
var exists = require('101/exists');
var mongoose = require('mongoose');
var uuid = require('uuid');
var boom = require('boom');
var debug = require('auto-debug')();
require('string_score');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var InviteSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  last_name: {
    type: String,
    index: true
  },
  nick: {
    type: String,
    index: true
  },
  address: {
    type: ObjectId,
    ref: 'Address',
    required: true
  },
  invitee: {
    type: [String],
    required: true,
    enum: {
      values: ['mehta', 'patel'],
      message: 'enum failed `{PATH}` with value `{VALUE}`'
    }
  },
  incomplete: {
    type: Boolean,
    default: false,
    index: true
  },
  family: {
    type: String,
    required: true,
    default: 'none',
    enum: {
      values: ['mehta', 'patel', 'none'],
      message: 'enum failed `{PATH}` with value `{VALUE}`'
    }
  },
  hash: {
    type: String,
    index: { unique: true }
  },
});

assign(InviteSchema.statics, require('./base').statics);
assign(InviteSchema.methods, require('./base').methods);

InviteSchema.statics.generateHash = function (data) {
  if (!exists(data.name) || !exists(data.address)) {
    throw boom.create(400, 'name and address are required', data);
  }
  var lower = data.name.toLowerCase();
  if (lower.length === 0) {
    return uuid();
  }
  return lower +':'+ data.address;
};

InviteSchema.statics.import = function (name, nameData, address, invitee, family, cb) {
  // data: multiName, label, address, maybe numInvited
  // nameData: names, lastName, nick, incomplete
  debug(arguments);
  var userData = {
    name: name,
    last_name: nameData.lastName,
    address: address._id,
  };
  if (nameData.names.length === 1 && nameData.hint) {
    userData.nick = nameData.hint;
  }
  if (!nameData.lastName) {
    userData.incomplete = true;
  }
  userData.invitee = invitee;
  userData.family = family;
  userData.hash = this.generateHash(userData);
  this.findSimilarOrCreate(userData, cb);
};


module.exports = mongoose.model('Invites', InviteSchema);