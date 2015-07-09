'use strict';

var assign = require('101/assign');
var find = require('101/find');
var last = require('101/last');
var pick = require('101/pick');
var assign = require('101/assign');
var isString = require('101/is-string');
var mongoose = require('mongoose');
var keypather = require('keypather')();
var deepEql = require('deep-eql');
var zipcodes = require('zipcodes');
var address = require('parse-address');
var trim = require('../lib/trim');
var map = require('object-loops/map');
var streetTypes = require('street-types');
var unique = require('array-uniq');
var Schema = mongoose.Schema;
var capitalize = require('i')().titleize;
var Counter = require('./counter');
var debug = require('auto-debug')();
var Events = {
  mehndi : Boolean,
  pithi  : Boolean,
  garba  : Boolean,
  wedding: Boolean,
  reception: Boolean
};
var Invite = {
  multiName: {
    type: String
  },
  prefix: {
    type: String
  },
  address: {
    type: String
  },
  family: {
    type: Boolean
  },
  lastName: {
    type: String,
    index: true
  },
  names: {
    type: [{
      type: String
    }],
    index: true
  },
  numInvited: {
    type: Number
  },
  events: {
    type: Events
  }
};

var AddressSchema = module.exports = new Schema({
  number: {
    type: String,
    index: true,
  },
  prefix: {
    type: String
  },
  street: {
    type: String,
    index: true,
    required: true
  },
  type: {
    type: String,
    index: true,
  },
  sec_unit_type: {
    type: String,
    index: true,
  },
  sec_unit_num: {
    type: String,
    index: true
  },
  city: {
    type: String,
    required: true,
    index: true
  },
  state: {
    type: String,
    required: true,
    index: true
  },
  zip: {
    type: String,
    required: true,
    index: true
  },
  hint: {
    type: String,
    index: true
  },
  incomplete: {
    type: Boolean,
    default: false,
    index: true
  },
  invite: {
    patel: {
      type: Invite
    },
    mehta: {
      type: Invite
    }
  },
  hash: {
    type: String,
    index: { unique: true }
  },
  new: Boolean
});

assign(AddressSchema.statics, require('./base').statics);
assign(AddressSchema.methods, require('./base').methods);

AddressSchema.statics.parseAddress = function (data) {
  debug('parseAddress');
  debug('parseAddress input', data);
  var out = address.parseLocation(data);
  debug('parseAddress output', out);
  if (out) {
    // normalize city and state info
    var zips = data.match(/[0-9]{5}/);
    var cityInfo, zip;

    if (zips) {
      zip = last(zips);
      debug('zips', zips, zip);
    }
    else {
      debug('lookupByName', out.city, out.state);
      zip = keypather.get(
        zipcodes.lookupByName(out.city || out.street, out.state || 'SC') || {},
        '[0].zip'
      );
      debug('no zips', zip);
    }
    cityInfo = zipcodes.lookup(zip);
    if (!out.state || !out.city) {
      // something is up..
      out.street = data;
    }
    assign(out, pick(cityInfo, 'city', 'state'));
    out.zip = zip;
  }
  return out;
};

AddressSchema.statics.generateHash = function (data) {
  if (data.address) {
    data = this.parseAddress(data);
  }
  data = map(data, function (val) {
    return val && isString(val) ?
      trim(val) : val;
  });
  var hash = [
    'number',
    'number',
    'number', //3x for more weight
    'street', // skipped street type
    'sec_unit_type',
    'sec_unit_num',
    'sec_unit_num',
    'sec_unit_num', //3x for weight
    'city',
    'state'
  ].reduce(function (hash, key) {
    var val = data[key];
    return val ?
      hash+' '+val :
      hash;
  }, '');

  return hash.trim();
};

AddressSchema.statics.nextUnknown = function (street, cb) {
  Counter.next('unknownAddress', function (err, count) {
    if (err) { return cb(err); }
    var address = {
      number: count.toString(),
      street: street || 'street',
      type: 'st',
      city: 'unknown',
      state: 'sc',
      zip: '00000'
    };
    debug('UNKNOWN!', address);
    cb(null, address);
  });
};

AddressSchema.statics.normalize = function (data) {
  if (data.type) {
    var type = data.type.toUpperCase();
    var found = find(streetTypes, function (typeObj) {
      return ~typeObj.abbrs.indexOf(type);
    });
    if (found) {
      data.type = capitalize(found.standardAbbr);
    }
  }
  return data;
};

AddressSchema.statics.import = function (invitee, data, nameData, cb) {
  // data: multiName, label, address, maybe numInvited
  // nameData: names, lastName, nick, incomplete
  var self = this;
  var addressData = data.address &&
    this.parseAddress(data.address);
  if (!addressData) {
    var street = nameData.lastName+nameData.hint;
    this.nextUnknown(street, function (err, unknownData) {
      if (err) { return cb(err); }
      addressData = unknownData;
      createAddress(cb);
    });
    return;
  }
  createAddress(cb);
  function createAddress (cb) {
    addressData.invite = {};
    addressData.invite[invitee] = {
      multiName: data.multiName,
      names   : nameData.names,
      lastName: nameData.lastName,
      family  : data.family,
      numInvited: data.numInvited,
      events  : data.events
    };
    addressData.hint = nameData.hint;
    addressData.incomplete = data.incomplete;
    self.normalize(addressData);
    addressData.hash = self.generateHash(addressData);
    self.findSimilarOrCreate(addressData, function (err, doc) {
      if (err) { return cb(err); }

      var docNames = toArray(
        keypather.get(doc, 'invite.'+invitee+'.names') || []
      );
      var invite = addressData.invite[invitee];
      var docInvite = doc.invite[invitee];
      var $set = {};
      if (!docInvite || deepEql(docNames, invite.names)) {
        $set['invite.'+invitee] = invite;
      } else {
        debug('error?', docNames, invite.names);
        var names = unique(docNames.concat(invite.names));
        $set['invite.'+invitee+'.names'] = names;
        $set['invite.'+invitee+'.multiName'] = names.join(', ');
        $set['invite.'+invitee+'.numInvited'] = Math.max(
          names.length,
          parseInt(docInvite.numInvited || 0)
        );
        debug('unique', doc.invite[invitee].names);
        debug('FULL invite', doc.invite[invitee]);
      }
      if (addressData.prefix && addressData.prefix !== doc.prefix) {
        debug('FIX PREFIX', docInvite.prefix, invite.prefix);
        $set.prefix = addressData.prefix;
      }
      self.findByIdAndUpdate(doc._id, { $set: $set }, {'new':true}, cb);
    });
  }
};

function toArray (thing) {
  var arr = [];
  for(var i=0; i<thing.length; i++) {
    arr.push(thing[i]);
  }
  return arr;
}

module.exports = mongoose.model('Addresses', AddressSchema);