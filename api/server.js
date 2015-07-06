'use strict';
var mongoose = require('mongoose');
var app = require('./lib/app');
/*
 * SERVER
 */
mongoose.connect('mongodb://'+process.env.MONGO, function (err) {
  if (err) { throw err; }
  console.log('Connected to mongo ' + process.env.MONGO);
  var port = app.get('port');
  app.listen(port, function (err) {
    if (err) { throw err; }
    console.log('Express server listening on port ' + port);
  });
});