'use strict';
var keypather = require('keypather')();

module.exports = toObj;

function toObj (keys, vals) {
  var obj = {};
  keys.forEach(function setKey (key, i) {
    var val = vals[i];
    if (/[,]/.test(key)) {
      key.split(',').forEach(function (key) {
        setKey(key, i);
      });
    }
    else if (/[0-9]$/.test(key)) {
      key = key.slice(0, -1);
      if (!obj[key]) {
        obj[key] = val;
      }
      else {
        obj[key] += ' ' + val;
      }
    }
    else if (/[.]/.test(key)) {
      keypather.set(obj,
        key,
        keypather.get(obj, key) || val);
    }
    else {
      obj[key] = val;
    }
  });

  return obj;
}