'use strict';

var boom = require('boom');

module.exports = errorHandler;

function errorHandler (err, req, res, next) {
  console.error('errorHandler', err.stack);
  if (!err.isBoom) {
    err = boom.wrap(err, 500);
  }
  if (err.data) {
    err.output.payload.debug = err.data;
  }
  res.send(err.output.statusCode, err.output.payload);
  res.next = next; // lint
}