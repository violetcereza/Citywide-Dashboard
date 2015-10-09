var React = require('react/addons');

// CSS
require('normalize.css');
require('../styles/main.css');

// BOOTSTRAP
import { Input, PageHeader, Tabs, Tab } from 'react-bootstrap';
require('bootstrap/dist/css/bootstrap.css');

var CwdApp = React.createClass({
  render: function() {
    return (
      <PrefsForm />
    );
  }
});

var prefsData = require('json!../prefs.json')[0];
var Messages = require('./Messages.js');
var Timing = require('./Timing.js');
var LandscapeComponents = require('./LandscapeComponents.js');
var Gauges = require('./Gauges.js');
var PrefsForm = React.createClass({
  render: function() {
    return (
      <form className="form-horizontal">
        <PageHeader>City Wide Dashboard Preferences</PageHeader>
        <Input type="text" label="Dashboard Name"
               placeholder="The title of this dashboard"
               value={this.props.prefs.name} />
        <Tabs defaultActiveKey={1} animation={false}>
          <Tab eventKey={1} title="Messages">
            <Messages messages={this.props.prefs.messageSections} />
          </Tab>
          <Tab eventKey={2} title="Timing">
            <Timing timing={this.props.prefs.timing} />
          </Tab>
          <Tab eventKey={3} title="Landscape Components">
            <LandscapeComponents components={this.props.prefs.landscape} />
          </Tab>
          <Tab eventKey={4} title="Gauges">
            <Gauges gauges={this.props.prefs.gauges} />
          </Tab>
        </Tabs>
      </form>
    );
  }
});

React.render(<PrefsForm prefs={prefsData} />, document.getElementById('content')); // jshint ignore:line

module.exports = CwdApp;
