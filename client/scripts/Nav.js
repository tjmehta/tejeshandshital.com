import React from 'react';
var put = require('101/put');
var exists = require('101/exists');
var debounce = require('debounce');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    var navTop = props.navTop;
    this.state = {
      windowScroll: window.scrollY || window.pageYOffset,
      navTop: navTop,
      navOpen: false
    };
    var boundHandleWindowChanges = this.handleWindowChanges.bind(this);
    if (window.onscroll === null) {
      window.onscroll = debounce(boundHandleWindowChanges, 10);
    }
    else {
      setInterval(boundHandleWindowChanges, 100);
    }
    window.onclick = this.handleWindowClick.bind(this);
  }
  handleWindowChanges() {
    var windowScroll = window.scrollY || window.pageYOffset;
    if (this.state.windowScroll !== windowScroll) {
      this.setState({
        windowScroll: windowScroll,
        navTop: this.props.navTop
      });
    }
  }
  handleWindowClick() {
    this.closeDropdown();
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.navTop !== nextProps.navTop) {
      this.setState({
        windowScroll: window.scrollY || window.pageYOffset,
        navTop: nextProps.navTop
      });
    }
  }
  toggleDropdown(e) {
    this.setState(
      put(this.state, 'dropdown', !this.state.dropdown)
    );
    e.preventDefault();
    e.stopPropagation();
  }
  closeDropdown() {
    this.setState(
      put(this.state, 'dropdown', false)
    );
  }
  toggleNav() {
    this.setState(
      put(this.state, 'navOpen', !this.state.navOpen)
    );
  }
  closeNav() {
    this.setState(
      put(this.state, 'navOpen', false)
    );
  }
  render() {
    var fixed = (this.state.windowScroll > this.state.navTop) ? true : false;
    return (
      <div className={ fixed ? 'navbar navbar-default z-index-100 fixed' : 'navbar navbar-default  z-index-100' }>
  			<div className="container">
  				<div className="navbar-header">
  					<button type="button" className="navbar-toggle" onClick={ this.toggleNav.bind(this) }>
  						<span className="icon-bar"></span>
  						<span className="icon-bar"></span>
  						<span className="icon-bar"></span>
  					</button>
  				</div>
  				<div className={ this.state.navOpen ? 'navbar-collapse collapse in' : 'navbar-collapse collapse' } >
  					<ul className="nav navbar-nav">
  						<li><a onClick={ this.closeNav.bind(this) } href="#about-us">About Us</a></li>
  						<li><a onClick={ this.closeNav.bind(this) } href="#proposal">Proposal Story</a></li>
  						<li><a onClick={ this.closeNav.bind(this) } href="#events">Events</a></li>
  						<li><a onClick={ this.closeNav.bind(this) } href="#accomodations">Accomodations</a></li>
  						<li><a onClick={ this.closeNav.bind(this) } href="#rsvp">RSVP</a></li>
              <li className={ this.state.dropdown ? "dropdown open" : "dropdown" }>
  							<a href="#" onClick={ this.toggleDropdown.bind(this) } className="dropdown-toggle" data-toggle="dropdown">Registries <b className="caret"></b></a>
  							<ul className="dropdown-menu">
  								<li><a onClick={ this.closeNav.bind(this) } href="http://www1.macys.com/registry/wedding/guest/?registryId=6349490" target="_blank">Macy's</a></li>
  								<li><a onClick={ this.closeNav.bind(this) } href="https://secure.williams-sonoma.com/registry/nw2x8nwrmc/registry-list.html" target="_blank">Williams and Sonoma</a></li>
  								<li><a onClick={ this.closeNav.bind(this) } href="http://www.bedbathandbeyond.com/store/giftregistry/view_registry_guest.jsp?pwsToken=&eventType=Wedding&registryId=542118486&pwsurl=" target="_blank">Bed & Bath</a></li>
  							</ul>
  						</li>
  					</ul>
            <div className="clear"></div>
  				</div>
  			</div>
  		</div>
    );
  }
}