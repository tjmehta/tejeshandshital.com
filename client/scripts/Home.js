import React from 'react';
var Nav = require('./Nav.js');
var RSVP = require('./RSVP.js');
var debounce = require('debounce');
var isMobile = require('ismobilejs');

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      windowHeight: window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight
    };
    window.onresize = debounce(this.handleWindowResize.bind(this), 10);
  }
  handleWindowResize() {
    var windowHeight = window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    if (this.state.windowHeight !== windowHeight) {
      this.setState({
        windowHeight: windowHeight
      });
    }
  }
  render() {
    var windowHeight = this.state.windowHeight;
    var minHeight = isMobile.phone ? 505 : 1010;
    var mainStyle = {
      height: windowHeight > minHeight ? windowHeight : minHeight
    };

    return (
      <div className="container-fluid">
        <div className="row section main blue" style={ mainStyle }>
          <div className="outer">
          <div className="middle">
          <div className="inner">

            <div className="col-sm-2"></div>
            <div className="col-sm-8 center-overlow-img">
              <div className="polaroid" data-sr="roll -15deg, wait 0.5s">
                <div className="overlay label">
                  <h1>Tejesh & Shital</h1>
                </div>
                <img src="/images/main.png" />
                <div className="polaroid-label">
                  <p>ARE TYING THE KNOT!</p>
                  <p className="break">
                    <span></span>
                    <i className="fa fa-heart"></i>
                    <span></span>
                  </p>
                  <p className="low-mar">AUGUST 22, 2015 - GREENVILLE, SC</p>
                </div>
              </div>
            </div>
            <div className="col-sm-2"></div>

          </div>
          </div>
          </div>
        </div>

        <Nav navTop={ mainStyle.height } />

        <div id="about-us" className="row section about-us">
          <div className="contain">
            <div className="heading">
              <h2>About Us</h2>
              <p className="break">
                <span></span><i className="fa fa-heart"></i><span></span>
              </p>
            </div>
            <div className="col-sm-6" data-sr="enter left, hustle 20px">
              <img className="img-circle" src="/images/tejesh.png" />
              <h5>TEJESH MEHTA</h5>
              <p> Born in Fremont, CA but was raised since preschool in Greer, SC. TJ left South Carolina to get his Computer Engineering degree at Georgia Tech in Atlanta, GA.
                After graduating, TJ spent time living in Washington, DC and Austin, TX. For the past few years, TJ has settled down in San Francisco, California, where he is
                the Chief Architect at a startup named Runnable. Everywhere he has lived, TJ is known for his techiness, spontaneity, and laid-back nature.</p>
            </div>
            <div className="col-sm-6" data-sr="enter right, hustle 20px">
              <img className="img-circle" src="/images/shital.png" />
              <h5>SHITAL PATEL</h5>
              <p>Born and raised in Easley, SC. Shital went to undergrad at Emory in Atlanta, GA. After Emory, Shital continued her education at USC Medical School in Columbia, SC.
                For the past few years, Shital has been in Birmingham, AL, where she is finishing up her Pediatric Residency. Shital will be moving to San Francisco as a General Pediatrician this Summer.
                Shital is known for her bubbliness, organizational skills, and gossip knowledge.</p>
            </div>
          </div>
          <div id="proposal" className="clear"></div>
        </div>

        <div className="proposal row section offwhite">
          <div className="contain">
            <div className="heading">
              <h2>The Proposal Story</h2>
              <p className="break">
                <span></span><i className="fa fa-heart"></i><span></span>
              </p>
            </div>
            <div className="col-sm-2"></div>
            <div className="col-sm-5" data-sr="enter left">
              <p className="story">
                Tejesh planned a sunset boat ride in the San Francisco Bay.
                The boat sailed around the bay going under the Golden Gate Bridge
                and around Angel Island. Just as the sunset began, Tejesh kneeled down
                and proposed. Shital, overwhelmed and surprised, said yes!
              </p>
            </div>
            <div className="col-sm-3" data-sr="enter right, wait 0.5s">
              <img className="img-circle" src="/images/proposal.png" />
            </div>
            <div className="col-sm-2"></div>
          </div>
          <div id="events" className="clear"></div>
        </div>

        <div className="events row section">
          <div className="contain">
            <div className="heading">
              <h2>Events</h2>
              <p className="break">
                <span></span><i className="fa fa-heart"></i><span></span>
              </p>
            </div>
            { this.eventCards() }
          </div>
          <div id="accomodations" className="clear"></div>
        </div>

        <div className="accomodations row offwhite section">
          <div className="contain">
            <div className="heading">
              <h2>Accomodations</h2>
              <p className="break">
                <span></span><i className="fa fa-heart"></i><span></span>
              </p>
            </div>
            <div className="col-sm-2"></div>
            <div className="col-sm-8">
              <p className="story">
              We have reserved a block of rooms for our guests at the Hyatt Regency Greenville.<br/><br/>
              <a href="https://resweb.passkey.com/go/PatelWeddingBlock82115" target="_blank" >Click here to make a reservation online.</a><br/><br/>
              If calling, please make sure to book under the "Patel Mehta Wedding" room block to get the discounted rate.<br/>
              </p>
            </div>
            <div className="col-sm-2"></div>
          </div>
          <div id="rsvp" className="clear"></div>
        </div>

        <RSVP />

        <div className="row section registries offwhite">
          <p>WE ARE REGISTERED AT</p>
          <div className="col-sm-3"></div>
          <div className="col-sm-2" data-sr>
            <a href="http://www1.macys.com/registry/wedding/guest/?registryId=6349490" target="_blank" className="registry-tile">
              <img src="/images/macys.png"></img>
            </a>
          </div>
          <div className="col-sm-2" data-sr>
            <a href="https://secure.williams-sonoma.com/registry/nw2x8nwrmc/registry-list.html" target="_blank" className="registry-tile">
              <img src="/images/williams.png"></img>
            </a>
          </div>
          <div className="col-sm-2" data-sr>
            <a href="http://www.bedbathandbeyond.com/store/giftregistry/view_registry_guest.jsp?pwsToken=&eventType=Wedding&registryId=542118486&pwsurl=" className="registry-tile">
              <img src="/images/bbb.png"></img>
            </a>
          </div>
          <div className="col-sm-3"></div>
        </div>

        <footer className="row">
					<div className="col-sm-12">
            <p>© 2015 TJ</p>
					</div>
    		</footer>
      </div>
    );
  }
  eventCards() {
    return [
      {
        id: 'event-garba',
        title: 'GARBA   &   RAAS',
        date: "AUGUST 21, 2015",
        image: '/images/garba.png',
        animate: 'enter left, wait 0.25s',
        text: <p>
          The festivities begin at 6pm<br/>
          <br/>
          Vedic Center<br/>
          Event Hall<br/>
          520 Bethel Drive<br/>
          Mauldin, SC 29662<br/>
        </p>,
        location: ['Vedic Center', 34.777153, -82.283206, 1]
      },
      {
        id: 'event-wedding',
        title: 'WEDDING CEREMONY',
        date: "AUGUST 22, 2015",
        image: '/images/wedding.png',
        animate: '',
        text: <p>
          The ceremony begins at 11am<br/>
          <br/>
          Hyatt Regency Greenville <br/>
          Regency Ballroom<br/>
          220 N. Main Street<br/>
          Greenville, SC 29601<br/>
        </p>,
        location: ['Hyatt Regency Greenville', 34.85315, -82.397123, 1]
      },
      {
        id: 'event-reception',
        title: 'WEDDING RECEPTION',
        date: "AUGUST 22, 2015",
        image: '/images/reception.png',
        animate: 'enter right, wait 0.5s',
        text: <p>
          Cocktail hour begins at 6pm<br/>
          <br/>
          Hyatt Regency Greenville <br/>
          Regency Ballroom<br/>
          220 N. Main Street<br/>
          Greenville, SC 29601<br/>
        </p>,
        location: ['Hyatt Regency Greenville', 34.85315, -82.397123, 1]

      }
    ].map(this.eventCard);
  }
  eventCard(data) {
    return <EventCard data={ data } />
  }
}

class EventCard extends React.Component {
  constructor(props) {
    super(props);
    google.maps.event.addDomListener(window, 'load', this.initialize.bind(this));
    this.state = props.data
  }
  initialize() {
    // Create an array of styles.
    var styles = [
      {
        "stylers": [
          { "saturation": -100 },
          { "gamma": 1 }
        ]
      },{
        "featureType": "water",
        "stylers": [
          { "lightness": -12 }
        ]
      }
    ];

    // Create a new StyledMapType object, passing it the array of styles,
    // as well as the name to be displayed on the map type control.
    var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});

    var place = this.state.location;
    var places = [
      place
    ];

    var mapOptions = {
      scrollwheel: false,
      zoom: 15,
      center: new google.maps.LatLng(place[1], place[2]),
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
      },
      draggable: false
    }
    var map = new google.maps.Map(document.getElementById(this.state.id), mapOptions);

    //Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');

    setMarkers(map, places);
    function setMarkers(map, locations) {
      // Add markers to the map
      var image = {
        url: '/images/map-marker.png',
        // This marker is 40 pixels wide by 42 pixels tall.
        size: new google.maps.Size(62, 58),
        // The origin for this image is 0,0.
        origin: new google.maps.Point(0,0),
        // The anchor for this image is the base of the pin at 20,42.
        anchor: new google.maps.Point(20, 58)
      };

      for (var i = 0; i < locations.length; i++) {
        var place = locations[i];
        var myLatLng = new google.maps.LatLng(place[1], place[2]);
        var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          icon: image,
          title: place[0],
          zIndex: place[3],
          animation: google.maps.Animation.DROP
        });

        var contentString = "Some content";
        google.maps.event.addListener(marker, "click", function() {
          infowindow.setContent(this.html);
          infowindow.open(map, this);
        });
      }
    }
  }
  render() {
    var data = this.state;
    return <div className="col-sm-4" data-sr={ data.animate }>
      <div className="event-card">
        <div id={ data.id } className="event-map"></div>
        <div className="event-content">
          <h5 className="title">{ data.title }</h5>
          <h5 className="pink">{ data.date }</h5>
          { data.text }
        </div>
      </div>
    </div>
  }
}