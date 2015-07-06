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
            <th>Mendhi</th>
            <th>Pithi</th>
            <th>Garba</th>
            <th>Wedding</th>
            <th>Reception</th>
          </tr>
          {
            this.state.rsvps.length === 0 ?
              <tr><td colSpan={ 5 } className="center-text">( None)</td></tr> :
              this.state.rsvps.map(function (r) {
                return r.rsvps.map(function (r) {
                  return <tr>
                    <td>{ r.name }</td>
                    <td>{ Boolean(r.events['mendhi'])+0+'' }</td>
                    <td>{ Boolean(r.events['pithi'])+0+'' }</td>
                    <td>{ Boolean(r.events['garba'])+0+'' }</td>
                    <td>{ Boolean(r.events['wedding'])+0+'' }</td>
                    <td>{ Boolean(r.events['reception'])+0+'' }</td>
                  </tr>;
                });
              })
          }
        </tbody>
      </table>
    );
  }
}