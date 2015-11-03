var React = require('react/addons');

// CSS
require('normalize.css');
require('../styles/main.css');

// BOOTSTRAP
import { Input, PageHeader, Tabs, Tab } from 'react-bootstrap';
require('bootstrap/dist/css/bootstrap.css');

var Messages = require('./Messages.js');
var Timing = require('./Timing.js');
var LandscapeComponents = require('./LandscapeComponents.js');
var Gauges = require('./Gauges.js');

var LinkedStateMixin = require('react-addons-linked-state-mixin');
var PrefsForm = React.createClass({
  mixins: [LinkedStateMixin],
  getInitialState: function() {
    return require('json!../prefs.json')[0];
  },
  handleStateChange: function(updateCommand) {
    this.setState(React.addons.update(this.state, updateCommand));
  },
  render: function() {
    return (
      <div>
        <PageHeader>Citywide Dashboard Preferences</PageHeader>
        <Input type="text" label="Dashboard Name"
               placeholder="The title of this dashboard"
               valueLink={this.linkState('name')} />
        <Tabs defaultActiveKey={1} animation={false} >
          <Tab eventKey={1} title="Messages" style={{marginTop: 20}}>
            <Messages parentHandleStateChange={this.handleStateChange} messages={this.state.messageSections} />
          </Tab>
          <Tab eventKey={2} title="Timing" style={{marginTop: 20}}>
            <Timing timing={this.state.timing} />
          </Tab>
          <Tab eventKey={3} title="Landscape Components" style={{marginTop: 20}}>
            <LandscapeComponents components={this.state.landscape} />
          </Tab>
          <Tab eventKey={4} title="Gauges" style={{marginTop: 20}}>
            <Gauges gauges={this.state.gauges} />
          </Tab>
        </Tabs>
      </div>
    );
  }
});

React.render(<PrefsForm />, document.getElementById('content')); // jshint ignore:line

module.exports = PrefsForm;
