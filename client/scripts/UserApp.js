import React from 'react';
var Home = require('./Home');

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Home />
        <div className="heart">
          <i className="fa fa-heart"></i>
        </div>
      </div>
    );
  }
}