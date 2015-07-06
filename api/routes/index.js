'use strict';

var RSVP = require('../models/rsvp');
var Address = require('../models/address');
var trim = require('../lib/trim');
var boom = require('boom');
var map = require('object-loops/map');
var xlsx = require('simple-xlsx');
var importer = require('../models/importer');
var debug = require('auto-debug')();


var app = require('express')();

app.get('', function (req, res) {
  res.send('hello');
});
//
// rsvp routes
//
app.post('/rsvps',
  require('body-parser').json(),
  function (req, res) {
    RSVP.create(req.body, res.reply);
  });
app.get('/rsvps', function (req, res) {
  RSVP.find(req.query, res.reply);
});
app.get('/rsvps/:id', function (req, res) {
  RSVP.findOne({
    _id: req.params.id
  }, res.reply);
});
app.patch('/rsvps/:id',
  require('body-parser').json(),
  function (req, res) {
    RSVP.findOneAndUpdate({
      _id: req.params.id
    }, {
      $set: req.body || {}
    }, {
      new: true
    }, res.reply);
  });

//
// address routes
//
app.post('/addresses', function (req, res) {
  if (req.query.force === 'true') {
    Address.create(req.body, res.reply);
  }
  else {
    Address.findOneDupe(req.body, function (err, dupe) {
      if (err ) { return res.reply(err); }
      if (dupe) { return res.reply(409, 'duplicate exists', { dupe: dupe }); }
      Address.create(req.body, res.reply);
    });
  }
});

app.get('/addresses', function (req, res) {
  if (req.query.fuzziness) {
    var fuzziness = req.query.fuzziness;
    delete req.query.fuzziness;
    Address.findSimilar(req.query, fuzziness, res.reply);
  }
  else {
    Address.find(req.query, res.reply);
  }
});

app.get('/addresses/:id', function (req, res) {
  Address.findOne({
    _id: req.params.id
  }, res.reply);
});

//
// import
//
app.post('/actions/import',
  require('connect-busboy')(),
  function (req, res) {
    debug(req.query.owner, !!req.busboy);
    if (!req.query.owner) { return res.reply(400, 'owner is required'); }
    // if (!req.busboy) { return res.reply(400, 'upload a file'); }
    // var count = createCount(2, done);
    // req.busboy.on('file', function (fieldname, file) {
    //   debug(arguments);
    //   // (fieldname, file, filename, encoding, mimetype)
    //   file.pipe(xlsx(parser));
    // });
    // req.busboy.on('field', function() {
    //   debug(arguments);
    // });
    // req.busboy.on('finish', count.next);
    // req.pipe(req.busboy);
    require('fs')
      .createReadStream(__dirname+'/../'+req.query.owner+'.xlsx')
      .pipe(xlsx(parser));
    function parser (err, table) {
      debug();
      if (err) { return res.reply(err); }
      importTable(req.query, table, done);
    }
    function done (err) {
      debug();
      if (err) { return res.reply(err); }
      res.reply(200, { success: true });
    }
  });

function importTable (opts, table, cb) {
  debug();
  var importByOwner = importer[opts.owner];
  if (!importByOwner) {
    return cb(boom.create(400, 'unexpected owner'));
  }
  importByOwner(opts, table, cb);
}

module.exports = app;