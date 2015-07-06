'use strict';

var Address = require('../../models/address');

module.exports = function (ctx, key) {
  return createAddress;
  function createAddress (cb) {
    Address.nextUnknown(function (err, address) {
      if (err) { return cb(err); }
      ctx[key] = address;
      Address.create(address, cb);
    });
  }
};

