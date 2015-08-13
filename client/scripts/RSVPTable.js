import React from 'react';
var put = require('101/put');
var pick = require('101/pick');
var exists = require('101/exists');
var keypather = require('keypather')();
var api = require('./api');
var Typeahead = require('./react-typeahead');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rsvps: []
    };
    this.fetchRsvps();
  }
  fetchRsvps() {
    api('/rsvps')
      .then(this.handleRsvps.bind(this))
      .catch(this.handleErr.bind(this));
  }
  handleRsvps(rsvps) {
    this.putState({
      rsvps: rsvps
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
      <table className="table">
        <tbody>
          <tr>
            <th>Name</th>
            <th>Mehndi</th>
            <th>Pithi</th>
            <th>Garba</th>
            <th>Wedding</th>
            <th>Reception</th>
          </tr>
          {
            this.state.rsvps.length === 0 ?
              <tr><td colSpan={ 5 } className="center-text">( None)</td></tr> :
              this.rsvpRows()
          }
        </tbody>
      </table>
    );
  }
  rsvpRows() {
    var eventTotals = {
      mehndi:    0,
      pithi:     0,
      garba:     0,
      wedding:   0,
      reception: 0
    };
    var rsvpRows = this.state.rsvps.map(function (r, i) {
      return r.rsvps.map(function (r) {
        var events = {
          mehndi:    Boolean(r.events.mehndi)   +0,
          pithi:     Boolean(r.events.pithi)    +0,
          garba:     Boolean(r.events.garba)    +0,
          wedding:   Boolean(r.events.wedding)  +0,
          reception: Boolean(r.events.reception)+0
        };
        eventTotals.mehndi += events.mehndi;
        eventTotals.pithi += events.pithi;
        eventTotals.garba += events.garba;
        eventTotals.wedding += events.wedding;
        eventTotals.reception += events.reception;
        return <tr className="green-text">
          <td>{ r.name }</td>
          <td>{ events.mehndi }</td>
          <td>{ events.pithi }</td>
          <td>{ events.garba }</td>
          <td>{ events.wedding }</td>
          <td>{ events.reception }</td>
        </tr>;
      });
    });
    // total row
    rsvpRows.unshift(
      <tr className="pink-text">
        <td><b>{ "TOTALS" }</b></td>
        <td><b>{ eventTotals.mehndi }</b></td>
        <td><b>{ eventTotals.pithi }</b></td>
        <td><b>{ eventTotals.garba }</b></td>
        <td><b>{ eventTotals.wedding }</b></td>
        <td><b>{ eventTotals.reception }</b></td>
      </tr>
    );
    return rsvpRows;
  }
}