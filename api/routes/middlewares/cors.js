'use strict';

var cors = require('cors');
var opts = {
  origin: function(origin, cb){
    cb(null, true); // always true
  }
};

module.exports = cors(opts);
