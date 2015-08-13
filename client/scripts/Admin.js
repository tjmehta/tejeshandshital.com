import React from 'react';
var put = require('101/put');
var pick = require('101/pick');
var exists = require('101/exists');
var keypather = require('keypather')();
var api = require('./api');
var Typeahead = require('./react-typeahead');
var RSVPTable = require('./RSVPTable');
var formatAddr = require('./format-addr');
var filter = require('object-loops/filter');
var assign = require('101/assign');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      missing: []
    };
    this.fetchAddresses();
    this.fetchRsvps();
  }
  fetchAddresses() {
    api('/addresses')
      .then(this.handleAddresses.bind(this))
      .catch(this.handleErr.bind(this));
  }
  fetchRsvps() {
    api('/rsvps')
      .then(this.handleRsvps.bind(this))
      .catch(this.handleErr.bind(this));
  }
  handleAddresses(addresses) {
    addresses = addresses.map(function (addr) {
      if (addr.invite.mehta && addr.invite.patel) {
        addr.invite.label = 'Mehta and Patel';
      }
      else if (addr.invite.mehta && !addr.invite.patel) {
        addr.invite.label = 'Mehta';
      }
      else if (!addr.invite.mehta && addr.invite.patel) {
        addr.invite.label = 'Patel';
      }
      addr.full = formatAddr(addr);
      return addr;
    });
    var rsvps = this.state.rsvps || {};
    this.putState({
      loading: false,
      addresses: addresses,
      missing: this.getMissing(addresses, this.state.rsvps)
    });
  }
  handleRsvps(rsvps) {
    var addresses = this.state.addresses || {};
    this.putState({
      rsvps: rsvps,
      missing: this.getMissing(this.state.addresses, rsvps)
    });
  }
  getMissing(addresses, rsvps) {
    if (!addresses || !rsvps || !addresses.length || !rsvps.length) {
      return [];
    }
    rsvps = rsvps.slice(); // copy
    var sortHash = {
      Mehta: {
        Patel: -1,
        'Mehta and Patel': -1
      },
      Patel: {
        Mehta: 1,
        'Mehta and Patel': -1
      },
      'Mehta and Patel': {
        Mehta: 1,
        Patel: 1
      }
    };
    return addresses
      .filter(function (addr) {
        var multiName =
          keypather.get(addr, 'invite.mehta.multiName') ||
          keypather.get(addr, 'invite.patel.multiName');
        return !rsvps.some(function (r, i) {
          if (r.address === addr._id) {
            rsvps.splice(i, 1);
            return true;
          }
        });
      })
      .sort(function (a, b) {
        var aMultiName =
          keypather.get(a, 'invite.mehta.multiName') ||
          keypather.get(a, 'invite.patel.multiName');
        var bMultiName =
          keypather.get(b, 'invite.mehta.multiName') ||
          keypather.get(b, 'invite.patel.multiName');
        if (a.invite.label === b.invite.label) {
          return sortByAlphabet(aMultiName, bMultiName);
        }
        else {
          return sortHash[a.invite.label][b.invite.label];
        }
      });
  }
  putState(changedState) {
    var newState = put(this.state, changedState);
    this.setState(newState);
  }
  handleErr(err) {
    console.error(err);
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
            <h4>Manual or Missing RSVPs</h4>
            <p>
              <span>Use this&nbsp;</span>
              <a
                  target="_blank"
                  href="https://docs.google.com/spreadsheets/d/1vwZZFwk2QnHAsJVa_ER-NtvaGQSQcDFtwa-Yns2HzMQ/edit?usp=sharing">
              Google Doc
              </a>
              <span>&nbsp;for now..</span>
            </p>
          </div>
          <div className="row well">
            <h4>Confirmed RSVPs</h4>
            <RSVPTable />
          </div>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <div className="row well">
            <h4>People not coming..</h4>
            <table className="table">
              <tbody>
                <tr>
                  <th>Name</th>
                  <th>Invited By</th>
                  <th>Num Invited</th>
                  <th>Events</th>
                </tr>
                {
                  this.state.missing.length === 0 ?
                    <tr><td colSpan={ 3 } className="center-text">( None)</td></tr> :
                    this.missingRows()
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
  missingRows() {
    return this.state.missing.map(function (addr) {
      var numInvited = Math.max(
        parseInt(keypather.get(addr, 'invite.mehta.numInvited') || 0),
        parseInt(keypather.get(addr, 'invite.patel.numInvited') || 0)
      )
      var multiName =
          keypather.get(addr, 'invite.mehta.multiName') ||
          keypather.get(addr, 'invite.patel.multiName');
      var mehtaEvents = keypather.get(addr, 'invite.mehta.events') || {};
      var patelEvents = keypather.get(addr, 'invite.patel.events') || {};
      //m
      mehtaEvents.mehndi = parseInt(mehtaEvents.mehndi || 0);
      mehtaEvents.pithi = parseInt(mehtaEvents.pithi || 0);
      mehtaEvents.garba = parseInt(mehtaEvents.garba || 0);
      mehtaEvents.wedding = parseInt(mehtaEvents.wedding || 0);
      mehtaEvents.reception = parseInt(mehtaEvents.reception || 0);
      //p
      patelEvents.mehndi = parseInt(patelEvents.mehndi || 0);
      patelEvents.pithi = parseInt(patelEvents.pithi || 0);
      patelEvents.garba = parseInt(patelEvents.garba || 0);
      patelEvents.wedding = parseInt(patelEvents.wedding || 0);
      patelEvents.reception = parseInt(patelEvents.reception || 0);
      var events = assign(
        {},
        mehtaEvents,
        patelEvents
      );
      events = filter(events, function (v) {
        return v>0;
      });
      return <tr>
        <td>{ multiName }</td>
        <td>{ addr.invite.label }</td>
        <td>{ numInvited }</td>
        <td>{ Object.keys(events).join(', ') }</td>
      </tr>;
    });
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
        ].join(''),
        suggestion: function (a) {
          return [
            '<div>',
              '<div>', a.full,'</div>',
              '<div>( ',
              (
                keypather.get(a, 'invite.mehta.multiName') ||
                keypather.get(a, 'invite.patel.multiName')
              ),
              ')</div>',
            '</div>',
          ].join('')
        }
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
    window.open('/rsvp/'+data._id+'?admin_mode');
  }
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

function sortByAlphabet (name1, name2) {
  if(name1 < name2) return -1;
  if(name1 > name2) return 1;
  return 0;
}