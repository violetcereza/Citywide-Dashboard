var React = require('react/addons');
var LinkedStateMixin = require('react-addons-linked-state-mixin');

// CSS
require('normalize.css');
require('../styles/main.css');

// BOOTSTRAP
import { Input, PageHeader, Tabs, Tab } from 'react-bootstrap';
require('bootstrap/dist/css/bootstrap.css');

var prefsData = require('json!../prefs.json')[0];
var Messages = require('./Messages.js');
var Timing = require('./Timing.js');
var LandscapeComponents = require('./LandscapeComponents.js');
var Gauges = require('./Gauges.js');
var PrefsForm = React.createClass({
  mixins: [LinkedStateMixin],
  getInitialState: function() {
    return require('json!../prefs.json')[0];
  },
  render: function() {
    return (
      <form className="form-horizontal">
        <PageHeader>Citywide Dashboard Preferences</PageHeader>
        <Input type="text" label="Dashboard Name"
               placeholder="The title of this dashboard"
               value={this.props.prefs.name} />
        <Tabs defaultActiveKey={1} animation={false}>
          <Tab eventKey={1} title="Messages">
            <Messages stateStore={this} messages={this.state.messageSections} />
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

module.exports = PrefsForm;
