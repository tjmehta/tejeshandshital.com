'use strict';

var qs = require('querystring');
var isEmpty = require('101/is-empty');
require('es6-promise').polyfill();
require('whatwg-fetch');
require('./load-env');
var methods = require('methods');
var fetch = window.fetch;

module.exports = api;

function api (method, path, data) {
  if (!~methods.indexOf(method.toLowerCase())) {
    data = path;
    path = method;
    method = 'GET';
  }
  path = (path[0] === '/') ?
    path :
    ('/' + path);

  var query, queryStr, opts = {};
  if (method === 'GET') {
    query = data || {};
    queryStr = isEmpty(query) ?
      '' :
      ('?'+qs.stringify(query));
  }
  else {
    queryStr = '';
    opts.body = JSON.stringify(data);
    opts.headers = {
      "Content-type": "application/json; charset=UTF-8"
    };
  }
  opts.method = method;
  console.log('api request', process.env.apiHost + path + queryStr, opts);
  return fetch(process.env.apiHost + path + queryStr, opts)
    .then(function(response) {
      return response.json();
    });
}

api.host = process.env.apiHost;
