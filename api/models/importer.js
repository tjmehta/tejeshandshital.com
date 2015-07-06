'use strict';
var findIndex = require('101/find-index');
var isObject = require('101/is-object');
var compose = require('101/compose');
var equals = require('101/equals');
var pluck = require('101/pluck');
var async = require('async');
var toObj = require('../lib/to-obj');
var parseName = require('../lib/parse-name');
var Address = require('./address');
var debug = require('auto-debug')();

var importer = module.exports = {};

importer.patel = function (opts, table, cb) {
  debug(opts, table.length);
  var rowStartingWithName = compose(equals('name'), pluck('[1].toLowerCase()'));
  var startIndex = findIndex(table, rowStartingWithName);
  console.log(startIndex);
  console.log(startIndex);
  console.log(startIndex);
  table = table.slice(startIndex + 1);
  // columns
  // Name Street Address  City, ST  ZIP Code  Relationship  Number in Party
  var keys = [
    'address0',
    'multiName',
    'address1', // city, state, zip
    'relationship',  // zip
    'numInvited',
    'events.mehndi',
    'ignore',
    'events.garba',
    'ignore',
    'events.wedding',
    'ignore',
    'events.reception',
  ];
  async.eachSeries(table, function (row, cb) {
    importRow('patel', keys, row, cb, 1);
  }, cb);
};

importer.mehta = function (opts, table, cb) {
  debug(opts, table.length);
  // columns
  // Full Name  Name on Label Address 1 City  State Zipcode Email Phone
  var keys = [
    'multiName',
    'numInvited',
    'relationship',
    'events.pithi',
    'events.garba,events.wedding,events.reception',
    'label',
    'address0', // street
    'address1', // city
    'address2', // state
    'address3',  // zip
    'events.garba', // OOO
    'events.garba,events.wedding',
  ];
  async.eachSeries(table, function (row, cb) {
    debug('mehta', 'eachSeries');
    // zip correction
    if (row[9] && row[9].toString().length === 4) {
      row[9] = '0'+row[9];
    }
    importRow('mehta', keys, row, cb);
  }, cb);
};

var maxNullRows = 3;
var nullRowCount = 0;
function importRow (invitee, keys, row, cb, reqIndex) {
  reqIndex = reqIndex || 0;
  row = row.map(function (val) {
    return isObject(val) && val.$text ?
      val.$text : val;
  });
  if (nullRowCount > maxNullRows) {
    debug('nullRowCount > maxNullRows');
    return cb();
  }
  if (!row[reqIndex]) {
    debug('nullRowCount', nullRowCount);
    nullRowCount++;
    return cb();
  }
  debug(arguments);
  nullRowCount = 0; // reset
  debug('row', row);
  var data = toObj(keys, row);
  data.family = /family/i.test(row.relationship);
  debug('data', data);
  var nameData = parseName(data.multiName);
  debug('nameDate', nameData);
  Address.import(invitee, data, nameData, function (err, address) {
    debug(arguments);
    if (err) {
      debug('Err w/ data:', data, nameData);
      return cb(err);
    }
    debug('address', address.hash);
    cb();
  });
}