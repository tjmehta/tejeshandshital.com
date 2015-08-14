import React from 'react';
var put = require('101/put');
var pick = require('101/pick');
var exists = require('101/exists');
var debounce = require('debounce');
var api = require('./api');
var Typeahead = require('./react-typeahead');
var formatAddr = require('./format-addr');

export default class App extends React.Component {
  constructor() {
    this.state = {
      addresses: []
    };
    this.fetchAddresses();
  }
  fetchAddresses() {
    api('/addresses')
      .then(this.handleAddresses.bind(this))
      .catch(this.handleErr.bind(this));
  }
  handleAddresses(addresses) {
    addresses = addresses.map(function (addr) {
      addr.full = formatAddr(addr);
      return addr;
    });
    this.putState({
      addresses: addresses
    });
  }
  handleErr(err) {
    this.putState({
      err: err
    });
  }
  putState(changedState) {
    var newState = put(this.state, changedState);
    this.setState(newState);
  }
  render() {
    return <div id="rsvp" className="rsvp row section pink">
      <div className="contain">
        <div className="heading">
          <h2 className="white-text">RSVP</h2>
          <p className="break white-text">
            <span></span><i className="fa fa-heart"></i><span></span>
          </p>
        </div>
        <div className="col-sm-2"></div>
        <div className="col-sm-8">
          <form onSubmit={ this.preventDefault.bind(this) }>
            <center className="white-text">
              <h4>RSVPs are closed! We are excited to see everyone :)</h4>
            </center>
          </form>
        </div>
        <div className="col-sm-2"></div>
      </div>
      <div id="registries" className="clear"></div>
    </div>;
  }
  getTypeahead() {
    var loading = this.state.addresses.length === 0;
    if (loading) {
      return <input className="form-control" type="text" placeholder={ 'Loading..' } />;
    }
    var placeholder = "Ex: 1 Main St, Greer, SC, 29650";
    var typeahead = {
      minLength: 7,
      highlight: true
    };
    var bloodhound = {
      datumTokenizer: function (addr) {
        var tokens = Bloodhound.tokenizers.whitespace(addr.full);
        return tokens.concat(tokens.map(concat('.')));
      },
      queryTokenizer: function (query) {
        return Bloodhound.tokenizers.whitespace(query);
      },
      local: this.state.addresses,
      identify: function(addr) { return addr._id; },
    };
    var datasource = {
      name: 'addresses',
      display: 'full',
      limit: 3,
      source: this.state.addresses,
      templates: {
        pending: '<div class="tt-searching tt-suggestion">Searching..</div>',
        empty:   [
          '<div class="tt-suggestion not-found">',
          'Address not found.<br/>',
          'Having problems? ',
          '<a href="mailto:tejesh.mehta@gmail.com">Email</a> or Call us.<br/>',
          '864-879-7173 ( Mehta\'s)<br/>',
          '864-297-0238 ( Patel\'s)',
          '</div>'
        ].join('')
      }
    };
    return <Typeahead
      typeahead={ typeahead }
      bloodhound={ bloodhound }
      datasource={ datasource }
      placeHolder={ placeholder }
      customEvents={ {'typeahead:selected': this.handleSelect.bind(this)} }
    ></Typeahead>;
  }
  preventDefault(evt) {
    evt.preventDefault();
  }
  handleSelect(evt, data) {
    window.open('/rsvp/'+data._id);
  }
}

function concat (b) {
  return function (a) {
    return a + b;
  };
}