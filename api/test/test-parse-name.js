'use strict';

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var expect = Code.expect;

var describe = lab.describe;
var it = lab.it;
var names = require('./mocks/names.js');
var parsedNames = require('./mocks/parsed-names.js');
var nameParser = require('../lib/parse-name.js');

describe('name parser', function () {

  it('it should parse the name into data', function (done) {
    names.forEach(function (name, i) {
      console.log('name!!', name, nameParser(name).names)
      expect(
        nameParser(name).names
      ).to.deep.contain(
        parsedNames[i].names
      );
    });
    done();
  });
});