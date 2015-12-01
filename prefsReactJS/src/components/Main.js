require('normalize.css');
require('styles/App.css');

import React from 'react';
import { PageHeader, Tabs, Tab } from 'react-bootstrap';
require('bootstrap/dist/css/bootstrap.min.css');
var update = require('react-addons-update');
var LinkedStateMixin = require('react-addons-linked-state-mixin');

import Messages from './Messages';
import Timing from './Timing';
import LandscapeComponents from './LandscapeComponents';
import Gauges from './Gauges';

var AppComponent = React.createClass({
  getInitialState: function() {
    return require('json!./prefs.json')[0];
  },
  handleStateChange: function(updateCommand) {
    this.setState(update(this.state, updateCommand));
  },
  render: function() {
    return (
      <div>
        <DashboardName name={this.state.name} parentHandleStateChange={this.handleStateChange} />
        <Tabs defaultActiveKey={1} animation={false} >
          <Tab eventKey={1} title="Messages" style={{marginTop: 20}}>
            <Messages messages={this.state.messageSections} parentHandleStateChange={this.handleStateChange} />
          </Tab>
          <Tab eventKey={2} title="Timing" style={{marginTop: 20}}>
            <Timing timing={this.state.timing} parentHandleStateChange={this.handleStateChange} />
          </Tab>
          <Tab eventKey={3} title="Landscape Components" style={{marginTop: 20}}>
            <LandscapeComponents components={this.state.landscape} parentHandleStateChange={this.handleStateChange} />
          </Tab>
          <Tab eventKey={4} title="Gauges" style={{marginTop: 20}}>
            <Gauges gauges={this.state.gauges} parentHandleStateChange={this.handleStateChange} />
          </Tab>
        </Tabs>
        <hr/>
        <div style={{ textAlign: "center", color: "gray", marginBottom: 20 }}>
          Developed by <a href="http://jasper.clarkberg.org/">Jasper Clarkberg</a>, <a href="https://github.com/juanbib">Juanbi Berretta</a>,
          and the <a href="http://environmentaldashboard.org/">Oberlin Environmental Dashboard Team</a>.
        </div>
      </div>
    );
  }
});

var DashboardName = React.createClass({
  mixins: [LinkedStateMixin],
  getInitialState: function() {
    return { editing: false };
  },
  toEditMode: function() {
    this.setState({
      editing: true,
      name: this.props.name
    });
  },
  saveChanges: function() {
    var updateCommand = {};
    updateCommand.name = {
      $set: this.state.name
    };
    this.props.parentHandleStateChange(updateCommand);
    this.setState({ editing: false });
  },
  render: function() {
    if (this.state.editing === false) {
      return (
        <PageHeader>Citywide Dashboard Preferences: <a onClick={this.toEditMode}>{this.props.name}</a>
        </PageHeader>
      );
    } else {
      return (
        <PageHeader>Citywide Dashboard Preferences:
            <input type="text" placeholder="Dashboard Name"
            valueLink={this.linkState('name')} onBlur={this.saveChanges} />
        </PageHeader>
      );
    }
  }
});


export default AppComponent;
