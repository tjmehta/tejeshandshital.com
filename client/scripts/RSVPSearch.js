import React from 'react';
var put = require('101/put');
var pick = require('101/pick');
var exists = require('101/exists');
var debounce = require('debounce');
var api = require('./api');
var formToObj = require('form-to-obj');
var Typeahead = require('./react-typeahead');

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
      // addr = pick(addr, [
      //   'number', 'street', 'type', 'sec_unit_type',
      //   'sec_unit_num', 'city', 'state', 'zip', 'invite'
      // ]);
      addr.full = formatAddr(addr);
      return addr;
    });
    this.putState({
      addresses: addresses
    });
    this.setupTypeAhead();
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
        <div className="col-sm-3"></div>
        <div className="col-sm-6">
          <form onSubmit={ this.handleSubmit.bind(this) }>
            <div className="form-group form-group-lg">
              <label className="white-text" for="address">
                Your Address (where you recieved your invite)
              </label>
            </div>
            <div className="form-group form-group-lg">
              { this.getTypeahead() }
            </div>
          </form>
        </div>
        <div className="col-sm-3"></div>
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
        return Bloodhound.tokenizers.whitespace(addr.full);
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
          '864-879-7173 (Mehtas)<br/> 864-297-0238 (Patels)',
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
  handleSubmit(evt) {
    evt.preventDefault();
  }
  handleSelect(evt, data) {
    window.open('/rsvp/'+data._id);
  }
}

function formatAddr (addr) {
  var str = '';
  str += (addr.number || '');
  str  = (str + ' ' + addr.street).trim();
  str  = (str + ' ' + (addr.sec_unit_type || '')).trim();
  str  = (str + ' ' + (addr.sec_unit_num  || '')).trim();
  str += ', ';
  str += (addr.city +', '+ addr.state +' '+ addr.zip);

  return str;
}