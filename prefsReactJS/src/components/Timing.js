import React from 'react';
import { Input, Grid, Row, Col, Button } from 'react-bootstrap';

var LinkedStateMixin = require('react-addons-linked-state-mixin');
require('styles//Timing.css');

var Timing = React.createClass({
  mixins: [LinkedStateMixin],
  getInitialState: function() {
    return { editing: false };
  },
  toEditMode: function() {
    var props = this.props.timing;
    props.editing = true;
    this.setState(props);
  },
  saveChanges: function() {
    var updateCommand = {};
    updateCommand.timing = {
      $set: this.state
    };
    this.props.parentHandleStateChange(updateCommand);
    this.setState({ editing: false });
  },
  render: function() {
    if (this.state.editing === false) {
      return (
        <Grid>
          <Row>
            <Col md={4}>
              <h4>Seconds for each message section</h4>
              <h2>{this.props.timing.delayBetweenMessages}</h2>
              <p>The messages at the top rotate between
              "Introduction Narration", "Resource Category",
              "Resource Explanation", etc. How long should
              each of these sections be displayed?</p>
            </Col>
            <Col md={4}>
              <h4>Seconds before play mode</h4>
              <h2>{this.props.timing.delayBeforePlayMode}</h2>
              <p>After a period of inaction, the Citywide Dashboard
              will start to switch between "Water", "Electrictity", etc.
              automatically. How long should the period of inaction be?
              If the dashboard is in "autoplay" mode, this setting is
              overridden.</p>
            </Col>
            <Col md={4}>
              <h4>Seconds on each screen when in play mode</h4>
              <h2>{this.props.timing.delayWhenPlaying}</h2>
              <p>When switching between "Water", "Electrictity", etc.
              automatically, how long should the dashboard stay on each
              type of resource? Automatically advancing cuts off some
              message sections, so you might want to take the
              "Seconds for each message section" property and multiply
              it by the number of message sections. (5)</p>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Button onClick={this.toEditMode} >Edit</Button>
            </Col>
          </Row>
        </Grid>
      );
    } else {
      return (
        <Grid>
          <Row>
            <Col md={4}>
              <Input type="text"
                  label="Seconds for each message section"
                  valueLink={this.linkState('delayBetweenMessages')} />
              <p>The messages at the top rotate between
              "Introduction Narration", "Resource Category",
              "Resource Explanation", etc.. How long should
              each of these sections be displayed?</p>
            </Col>
            <Col md={4}>
              <Input type="text"
                  label="Seconds before play mode"
                  valueLink={this.linkState('delayBeforePlayMode')} />
              <p>After a period of inaction, the Citywide Dashboard
              will start to switch between "Water", "Electrictity", etc.
              automatically. How long should the period of inaction be?
              If the dashboard is in "autoplay" mode, this setting is
              overridden.</p>
            </Col>
            <Col md={4}>
              <Input type="text"
                  label="Seconds on each screen when playing"
                  valueLink={this.linkState('delayWhenPlaying')} />
              <p>When switching between "Water", "Electrictity", etc.
              automatically, how long should the dashboard stay on each
              type of resource? Automatically advancing cuts off some
              message sections, so you might want to take the
              "Seconds for each message section" property and multiply
              it by the number of message sections. (5)</p>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Button onClick={this.saveChanges}>Save</Button>
            </Col>
          </Row>
        </Grid>
      );
    }
  }
});

module.exports = Timing;
