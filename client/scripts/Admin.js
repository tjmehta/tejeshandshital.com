import React from 'react';
var put = require('101/put');
var pick = require('101/pick');
var exists = require('101/exists');
var keypather = require('keypather')();
var api = require('./api');
var formToObj = require('form-to-obj');
var Typeahead = require('./react-typeahead');
var RSVPTable = require('./RSVPTable');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
    this.fetchAddresses();
  }
  fetchAddresses() {
    api('/addresses')
      .then(this.handleAddresses.bind(this))
      .catch(this.handleErr.bind(this));
  }
  fetchManualRSVPs() {
    api('/rsvps', { address: {$exists:false} })
      .then(this.handleManualRSVPs.bind(this))
      .catch(this.handleErr.bind(this));
  }
  handleAddresses(addresses) {
    addresses = addresses.map(function (addr) {
      addr.full = formatAddr(addr);
      return addr;
    });
    this.putState({
      loading: false,
      addresses: addresses
    });
  }
  handleManualRSVPs(rsvps) {
    var addresses = (this.state.addresses || []).slice();
    this.putState({
      loading: false,
      addresses: addresses.concat(rsvps.map(rsvpToAddress))
    });
  }
  putState(changedState) {
    var newState = put(this.state, changedState);
    this.setState(newState);
  }
  handleErr(err) {
    alert(err.message + ' Please reload page');
  }
  render() {
    return (
      <div className="admin">
        <div className="container">
          <div className="row blue">
            <h1>Admin</h1>
          </div>
          <div className="row well">
            <h4>RSVP Search</h4>
            <form onSubmit={ this.preventDefault.bind(this) }>
              <div className="form-group form-group-lg">
                <label for="address">
                  Search
                </label>
                { this.getTypeahead() }
              </div>
            </form>
          </div>
          <div className="row well">
            <h4>Confirmed RSVPs</h4>
            <RSVPTable />
          </div>
        </div>
      </div>
    );
  }
  getTypeahead() {
    if (this.state.loading) {
      return <input className="form-control" type="text" placeholder={ 'Loading..' } />;
    }
    var placeholder = "Name or Address";
    var typeahead = {
      minLength: 2,
      highlight: true
    };
    var bloodhound = {
      datumTokenizer: function (addr) {
        var tokens = [];
        if (addr.isRSVP) {
          return concatInviteTokens(addr);
        }
        tokens = Bloodhound.tokenizers.whitespace(addr.full);
        if (addr.invite.patel) {
          concatInviteTokens(addr.invite.patel);
        }
        else if (addr.invite.mehta) {
          concatInviteTokens(addr.invite.mehta);
        }
        if (tokens.length === 0) {
          console.log('DAFUQ', addr.invite);
        }
        return tokens;
        function concatInviteTokens (invite) {
          var names = (invite.names || []).slice();
          if (invite.lastName) {
            names.push(invite.lastName)
          }
          names.forEach(function (name) {
            tokens = tokens.concat(
              Bloodhound.tokenizers.whitespace(name)
            );
          });
        }
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

function formatAddr (addr) {
  var str = '';
  var patelMultiName = keypather.get(addr, 'invite.patel.multiName');
  var mehtaMultiName = keypather.get(addr, 'invite.mehta.multiName');
  if (addr.isRSVP) {
    return 'Manual RSVP: ' + rsvp.nameStr;
  }
  if (addr.zip === '00000') {
    return 'Unknown address *Use as last resort*: ' +
      (mehtaMultiName || patelMultiName);
  }
  str += (addr.number || '');
  str  = (str + ' ' + addr.street + ' ' + (addr.type || '')).trim();
  str  = (str + ' ' + (addr.sec_unit_type || '')).trim();
  str  = (str + ' ' + (addr.sec_unit_num  || '')).trim();
  str += ', ';
  str += (addr.city +', '+ addr.state +' '+ addr.zip);

  return str;
}
function rsvpToAddress (rsvp) {
  var names = rsvp.rsvps.map(pluck('name'));
  var maxlength = 30;
  var nameStr = names.join(', ');
  if (nameStr.length > maxlength) {
    nameStr = nameStr.slice(0, maxlength) + '...';
  }
  return {
    names: names,
    nameStr: nameStr,
    isRSVP: true
  };
}