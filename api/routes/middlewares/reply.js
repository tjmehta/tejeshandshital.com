'use strict';

var boom = require('boom');

module.exports = addReply;

function addReply (req, res, next) {
  res.reply = reply;
  next();
  // methods
  function reply (errOrCode, data) {
    if (errOrCode instanceof Error || errOrCode >= 400) {
      return error.apply(null, arguments);
    }
    else if (!data) {
      var resource = req.url.split('/').shift();
      error(404, resource+' not found', { params: req.params });
    }
    console.error('json', arguments);
    res.json(data);
  }
  function error (errOrCode, message, data) {
    var err, code;
    if (errOrCode instanceof Error) {
      err = errOrCode;
    }
    else {
      code = errOrCode;
      err = boom.create(errOrCode, message, data);
    }
    next(err);
  }
}