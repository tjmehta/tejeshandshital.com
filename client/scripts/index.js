import React from 'react';
import UserApp from './UserApp';
import Home from './Home';
import Router from 'react-router';
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var NotFoundRoute = Router.NotFoundRoute;

require('../styles/master.sass');

// Config
require('./load-env');

// Routes
var routes = (
  <Route path="/">
    <DefaultRoute handler={UserApp} />
    <Route path="admin" handler={require('./AdminSearch')} />
    <Route path="rsvp/:id" handler={require('./RSVP')} />
  </Route>
);

if (window.history) {
  if (~window.location.href.indexOf('/#/')) {
    window.location = window.location.href.split('/#').pop();
  }

  // Or, if you'd like to use the HTML5 history API for cleaner URLs:
  Router.run(routes, Router.HistoryLocation, function (Handler) {
    React.render(<Handler/>, document.querySelector('#root'));
  });
}
else {
  var path = window.location.pathname;
  if (!~window.location.href.indexOf('/#/') && path.length > 1) {
    window.location = '/#'+path;
  }
  Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.querySelector('#root'));
  });
}
