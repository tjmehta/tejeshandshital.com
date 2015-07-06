import React from 'react';

var api = require('./api');
var put = require('101/put');
var pluck = require('101/pluck');
var clone = require('101/clone');
var passAll = require('101/pass-all');
var noop = require('101/noop');
var not = require('101/not');
var keypather = require('keypather')();
var createCount = require('callback-count');
var RSVPForm = require('./RSVPForm');
var isMobile = require('ismobilejs');
var reduce = require('object-loops/reduce');
var filter = require('object-loops/filter');
var formToObj = require('form-to-object');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rsvps: this.props.rsvps,
      events: this.props.events,
      rsvpId: this.props.rsvpId,
      showNotifications: this.props.showNotifications,
      addressId: this.props.addressId
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      rsvps: nextProps.rsvps,
      events: nextProps.events,
      rsvpId: nextProps.rsvpId,
      showNotifications: nextProps.showNotifications,
      addressId: nextProps.addressId
    });
  }
  render() {
    var self = this;
    var events = this.state.events || {};
    var eventNames = Object.keys(events).filter(function (event) {
      return events[event]; // truthy
    }).map(capitalize);
    var rsvps = this.state.rsvps || [];
    var tabIndex = 0;
    var messages = rsvps
      .filter(
        passAll(pluck('name.trim()'), hasEventsTrue)
      )
      .map(function (rsvp) {
        var events = filter(rsvp.events, truthy);
        var eventNames = Object.keys(events).map(capitalize);
        return rsvp.name + ' is confirmed for the ' + joinNames(eventNames);
      });
    return <form
          onSubmit={ this.preventDefault.bind(this) }
          className={ isMobile.phone ? 'mobile' : '' }>
      <div
          style={ { height: this.state.showNotifications ? 71*(messages.length || 1) : 0 } }
          className={ this.state.showNotifications ? 'slide in' : 'slide' }>
        {
          messages.length ?
            messages.map(function (msg) {
              return <div key={msg} className="alert alert-success" role="alert">
                <strong>Saved!&nbsp;</strong>{msg}
              </div>;
            }) :
            <div key={100} className="alert alert-success" role="alert">
              <strong>Saved!&nbsp;</strong><span>Noone is coming to any events</span>
            </div>
        }
      </div>
      <div className={ this.state.showErr ? 'slide in' : 'slide' }>
        <div key={100} className="alert alert-danger" role="alert">
          <strong>Uh oh!&nbsp;</strong><span>{ this.state.showErr }</span>
        </div>
      </div>
      <table className="table">
        <tbody>
        <tr>
          <th>Attendee</th>
        {
          eventNames.map(function (name) {
            return <th key={name}>{ name }</th>;
          })
        }
        </tr>
        {
          rsvps.map(function (rsvp, i) {
            rsvp.events = rsvp.events || {};
            return <tr key={ rsvp._id || i }>
              <td>
                <input
                    onChange={ self.linkState.bind(self) }
                    className="form-control"
                    type="text"
                    name={ getInputName(i, 'name') }
                    placeholder="Full Name"
                    value={ rsvp.name }
                    tabIndex={ tabIndex++ } />
              </td>
              {
                eventNames.map(function (event) {
                  var lower = event.toLowerCase()
                  return <td key={event}>
                     <div className="checkbox">
                      <label>
                        <input
                            onChange={ self.linkState.bind(self) }
                            type="checkbox"
                            name={ getInputName(i, 'events.'+lower ) }
                            checked={ rsvp.events[lower] }
                            tabIndex={ tabIndex++ } />
                      </label>
                    </div>
                  </td>;
                })
              }
            </tr>;
          })
        }
        </tbody>
      </table>
      {
        this.state.addressId ?
          <input type="hidden" name="address" value={ this.state.addressId } /> :
          <div className="hide"></div>
      }
      {
        this.state.rsvpId ?
          <input type="hidden" name="_id" value={ this.state.rsvpId } /> :
          <div className="hide"></div>
      }
      <button
          type="submit"
          onClick={this.handleSubmitClick.bind(this)}
          className="btn btn-primary btn-block">Save</button>
    </form>;
  }
  linkState(evt) {
    var $input = evt.currentTarget;
    var newState = clone(this.state);
    var val = $input.type === 'checkbox' ?
      $input.checked :
      $input.value;
    keypather.set(newState, $input.name, val);
    return this.setState(newState);
  }
  handleSubmitClick() {
    var self = this;
    var $form = React.findDOMNode(this);
    var data = formToObj($form);
    data = keypather.expand(data);
    var namesWithNoEvents = data.rsvps
      .filter(
        passAll(
          pluck('name.trim()'),
          not(hasEventsTrue)
        )
      ).map(pluck('name.trim()'));
    debugger;
    if (namesWithNoEvents.length) {
      this.setState(put(this.state, 'showErr', 'Please select events for '+joinNames(namesWithNoEvents)+'( or remove the name)'));
      setTimeout(function () {
        self.setState(put(self.state, 'showErr', false));
      }, 3000);
      return;
    }
    this.props.handleSubmit(data);
  }
  preventDefault(evt) {
    evt.preventDefault();
  }
}

function getInputName (i, name) {
  return 'rsvps['+i+'].'+name;
}
function capitalize (str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
}
function truthy (v) {
  return Boolean(v);
}
function hasEventsTrue (rsvp) {
  return reduce(rsvp.events || {}, function (bool, val) {
    return bool || val;
  }, false);
}
function joinNames (names) {
  if (names.length === 1) return names;
  var lastName = names.pop();
  var str = names.join(', ');
  return str += ' and ' + lastName;
}