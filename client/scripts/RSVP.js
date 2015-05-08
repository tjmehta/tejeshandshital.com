import React from 'react';
var put = require('101/put');
var exists = require('101/exists');
var debounce = require('debounce');

export default class App extends React.Component {
  render() {
    return <div id="rsvp" className="events row offwhite section">
      <div className="contain">
        <div className="heading">
          <h2>RSVP</h2>
          <p className="break">
            <span></span><i className="fa fa-heart"></i><span></span>
          </p>
        </div>
        <div className="text-center">
        <h2>Coming Soon...</h2>
        </div>
      </div>
      <div id="registries" className="clear"></div>
    </div>;
  }
}