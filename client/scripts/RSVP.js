import React from 'react';
var put = require('101/put');
var exists = require('101/exists');
var debounce = require('debounce');
var api = require('./api');

export default class App extends React.Component {
  render() {
    return <div id="rsvp" className="events row section">
      <div className="contain">
        <div className="heading">
          <h2>RSVP</h2>
          <p className="break">
            <span></span><i className="fa fa-heart"></i><span></span>
          </p>
        </div>
        <div className="col-sm-4"></div>
        <div className="col-sm-4">
          <form className="bs-example bs-example-form" data-example-id="input-group-sizing">
            <div className="input-group input-group-lg">
              <label for="address">
                Your Address (or where you recieved your invite)
              </label>
              <input
                  name="address"
                  onChange={this.handleChange}
                  type="text"
                  className="form-control"
                  placeholder="Address"
                  aria-describedby="your-address" />
            </div>
          </form>
        </div>
        <div className="col-sm-4"></div>
      </div>
      <div id="registries" className="clear"></div>
    </div>;
  }
  handleChange() {
    console.log('yolo')
  }
}