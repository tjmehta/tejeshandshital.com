/**
 * Module dependencies.
 */

var express = require('express');
/*
 * APP CONFIGURATION
 */
var app = module.exports = express();
// config
app.set('port', parseInt(process.env.PORT, 10) || 3001);
app.use(require('express-domain-middleware'));
app.use(require('body-parser').json());
app.use(require('../routes/middlewares/cors'));
app.use(require('../routes/middlewares/reply'));
app.use(require('../routes'));
app.use(require('../routes/middlewares/error-handler'));
