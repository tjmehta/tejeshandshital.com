import React from 'react';

var apiHost = require('./api').host;
var importUrl = apiHost + '/actions/import';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="admin">
        <div className="container">
          <div className="row blue">
            <h1>Admin</h1>
          </div>
          <div className="row well">
          </div>
        </div>
      </div>
    );
  }
  handleFamilyChange(evt) {
    var family = evt.currentTarget.value;
    this.setState({ family: family });
    console.log(this.state);
  }
}