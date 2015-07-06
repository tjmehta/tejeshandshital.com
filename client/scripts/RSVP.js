import React from 'react';

var api = require('./api');
var put = require('101/put');
var clone = require('101/clone');
var assign = require('101/assign');
var exists = require('101/exists');
var pluck = require('101/pluck');
var compose = require('101/compose');
var createCount = require('callback-count');
var RSVPForm = require('./RSVPForm');
var keypather = require('keypather')();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.addressId = this.props.params.id;
    this.state = {};
    this.fetchAddress();
    this.fetchRSVPs();
    if (document.head && document.head.querySelector) {
      document.head.querySelector('title').innerHtml = 'RSVP - Tejesh & Shital';
    }
  }
  fetchAddress() {
    api('/addresses/' + this.addressId)
      .then(this.handleAddress.bind(this))
      .catch(this.handleErr.bind(this));
  }
  fetchRSVPs() {
    api('/rsvps', { address: this.addressId })
      .then(this.handleRSVPs.bind(this))
      .catch(this.handleErr.bind(this));
  }
  handleAddress(address) {
    if (address.error) {
      return this.handleErr(address);
    }
    var invite = address.invite;
    var inviteCount = Math.max(
      parseInt(keypather.get(invite, 'patel.numInvited') || 0),
      parseInt(keypather.get(invite, 'mehta.numInvited') || 0)
    );
    var events = {};
    assign(
      events,
      keypather.get(invite, 'patel.events') || {},
      keypather.get(invite, 'mehta.events') || {}
    );
    var newState = put(this.state, 'invite', {
      address: formatAddr(address),
      count : inviteCount,
      events: events
    });
    console.log(newState, invite);
    this.setState(newState);
    this.address = address;
    this.checkReady();
  }
  handleRSVPs(rsvps) {
    if (rsvps.error) {
      return this.handleErr(rsvps);
    }
    var rsvp = rsvps[0] || {};
    var newState = put(this.state, 'rsvps', rsvp.rsvps || []);
    this.setState(newState);
    this.rsvps = rsvps;
    this.rsvpId = rsvp._id;
    this.lastRsvp = this.rsvp;
    this.rsvp = rsvp;
    this.checkReady();
  }
  checkReady() {
    if (!this.rsvps || !this.address) { return; }
    var rsvps = clone(this.state.rsvps); // copy
    var inviteCount = this.state.invite.count;
    var events = this.state.invite.events;
    var rsvpsLength = rsvps.length;
    for (var i = 0; i < (inviteCount - rsvpsLength); i++) {
      rsvps.push({
        name: ''
      });
    }
    var newState = put(this.state, {
      className: 'in',
      rsvps: rsvps
    });
    this.setState(newState);
  }
  render() {
    var className = this.state.className || '';
    this.state.invite = this.state.invite || {};
    var events = keypather.get(this, 'state.invite.events') || {};
    return (
      <div id="rsvp" className={ className }>
        <div className="container">
          <div className="row section card pink">
            <div className="contain">
              <div className="heading">
                <h2 className="white-text">RSVP</h2>
                <p className="break white-text">
                  <span></span><i className="fa fa-heart"></i><span></span>
                </p>
              </div>
              {
                this.state.err?
                  <div>
                    <h3>RSVP Error: {this.state.err}</h3>
                    <h3>Make sure your url is correct.</h3>
                  </div> :
                  <div>
                    <div className="col-sm-12">
                      <h4>
                        <span>RSVP for&nbsp;</span>
                        <strong>{ this.state.invite.address }</strong>
                      </h4>
                    </div>
                    <div className="col-sm-1"></div>
                    <div className="col-sm-10">

                      <RSVPForm
                          handleSubmit={ this.handleSubmit.bind(this) }
                          rsvps={ this.state.rsvps }
                          events={ events }
                          rsvpId={ this.rsvpId }
                          showNotifications={ this.state.showNotifications }
                          addressId={ this.props.params.id } />
                    </div>
                    <div className="col-sm-1"></div>
                  </div>
              }
            </div>
            <div className="col-sm-12 center-text">
              <span>Having problems? </span>
              <a href="mailto:tejesh.mehta@gmail.com">Email</a><span> or Call us.</span><br/>
              <span>864-879-7173 ( Mehta's)</span><br/>
              <span>864-297-0238 ( Patel's)</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  handleSubmit(data) {
    var self = this;
    data.rsvps = data.rsvps.filter(pluck('name.trim()'));
    if (data._id) {
      api('PATCH', '/rsvps/'+data._id, data)
        .then(handleRSVP)
        .catch(this.handleErr.bind(this));
    }
    else {
      api('POST', '/rsvps', data)
        .then(handleRSVP)
        .catch(this.handleErr.bind(this));
    }
    function handleRSVP (rsvp) {
      var newState = put(self.state, 'showNotifications', true);
      self.setState(newState);
      self.handleRSVPs([rsvp]);
      setTimeout(function () {
        var newState = put(self.state, 'showNotifications', false);
        self.setState(newState);
      }, 5000);
    }
  }
  handleErr(err) {
    this.setState({
      err: err.message
    });
  }
}

function formatAddr (addr) {
  var str = '';
  str += (addr.number || '');
  str  = (str + ' ' + addr.street + ' ' + (addr.type || '')).trim();
  str  = (str + ' ' + (addr.sec_unit_type || '')).trim();
  str  = (str + ' ' + (addr.sec_unit_num  || '')).trim();
  str += ', ';
  str += (addr.city +', '+ addr.state +' '+ addr.zip);

  return str;
}