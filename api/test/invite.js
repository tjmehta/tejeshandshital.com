'use strict';

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var expect = Code.expect;

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var beforeEach = lab.beforeEach;
var User = require('../models/user');
var nameData = require('./mocks/name-data');

describe('user', function () {
  var ctx;
  before(require('./fixtures/mongoose').connect);
  beforeEach(require('./fixtures/mongoose').dropCollection('users'));
  beforeEach(function (done) {
    ctx = {};
    done();
  });
  after(require('./fixtures/mongoose').disconnect);

  describe('import', function () {
    before(require('./fixtures/create-address')(ctx));

    describe('full data', function () {
      before(function (done) {
        ctx.nameData = {
          names: ['Tejesh Mehta', 'Bhavesh Mehta'],
          lastName: 'Mehta'
        };
        ctx.invitee = ctx.family = 'mehta';
        done();
      });

      itShouldImportAUser();
    });
    describe('partial data', function () {
      before(function (done) {
        ctx.nameData = {
          names: ['Tejesh', 'Bhavesh']
        };
        ctx.invitee = 'patel';
        ctx.family = 'mehta';
        done();
      });

      itShouldImportAUser();
    });
    function itShouldImportAUser () {
      it('it should import a user', function (done) {
        var nameData = ctx.nameData;
        var name = nameData.names[0];
        var address = ctx.address;
        User.import(
          name, nameData, address, ctx.invitee, ctx.family,
          function (err, user) {
            if (err) { return done(err); }
            expect(user.toJSON()).to.deep.contain({
              name: name,
              last_name: nameData.lastName,
              address: address._id.toString(),
              invitee: ctx.invitee,
              family : ctx.family,
              incomplete: false
            });
            done();
          });
      });
    }

    describe('similar user exists', function() {

      it('should find similar if similar user exists', function (done) {
        done();
      });
    });
  });
});