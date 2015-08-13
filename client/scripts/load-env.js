'use strict';
// quick and easy config
var config = {};

var mrlocal = /[.]local/.test(window.location.href);
var localhost = ~window.location.href.indexOf('localhost');

config.dev = {
  apiHost: mrlocal ?
    'http://mrpro.local:3001':
    'http://localhost:3001'
};

config.dev =
config.prod = {
  apiHost: 'http://api.tejeshandshital.com'
};

process.env =  (localhost || mrlocal) ?
  config.dev :
  config.prod;

return process.env;