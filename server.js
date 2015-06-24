var Hapi = require('hapi');
var Good = require('good');
var createCount = require('callback-count');
var envIs = require('101/env-is');
var assign = require('101/assign');
var join = require('path').join;

var server = new Hapi.Server();
server.connection({ port: process.env.PORT || 3000 });

// if (!envIs('development')) {
server.route({
  method: 'GET',
  path: '/{param*}',
  handler: {
      directory: {
          path: 'client'
      }
  }
});

/** FRONTEND ROUTES */
server.route({
  method: 'GET',
  path: '/admin',
  handler: function (request, reply) {
    reply.file(join(__dirname, 'client/index.html'));
  }
});


// Plugins
var pluginCount = createCount(startServer);

if (envIs('development')) {
  var webpackConf = require('./client/webpack.config.js');
  assign(webpackConf, {
    entry: {
      app: './client/scripts/index.js' //this is needed to have the correct relative paths for the webpack compiler which now runs from the base dir rather than from webpack_frontend
    },
    devtool: 'source-map'
  });

  server.register({
    register: require('hapi-webpack-dev-plugin'),
    options: {
      compiler: require('webpack')(webpackConf),
      // hot  : true,
      // publicPath: webpackConf.output.publicPath,
      hot: true,
      publicPath: './client',
      historyApiFallback: true,
      contentBase: './client',
      devIndex: './client'
    }
  }, pluginCount.inc().next);
}

server.register({
  register: Good,
  options: {
    reporters: [{
      reporter: require('good-console'),
      events: {
        response: '*',
        log: '*'
      }
    }]
  }
}, pluginCount.inc().next);

// Start Server
function startServer (err) {
  if (err) { throw err; } // something bad happened loading a plugin

  server.start(function () {
    server.log('info', 'Server running at: ' + server.info.uri);
  });
}