import React from 'react';
import { Input, Grid, Row, Col, Well, Tabs, Tab, Button, Panel } from 'react-bootstrap';

var Gauges = React.createClass({
  handleStateChange: function(gaugeUpdateCommand) {
    var updateCommand = {};
    updateCommand.gauges = gaugeUpdateCommand;
    this.props.parentHandleStateChange(updateCommand);
  },
  render: function() {
    var gauges = this.props.gauges;
    return (
      <Tabs defaultActiveKey={0} position="left" animation={false}>
        <Tab eventKey={0} title="Landing Page">
          <GaugeList gauges={gauges.none} slug={"none"} parentHandleStateChange={this.handleStateChange} />
        </Tab>
        <Tab eventKey={1} title="Electricity">
          <GaugeList gauges={gauges.electricity} slug={"electricity"} parentHandleStateChange={this.handleStateChange} />
        </Tab>
        <Tab eventKey={2} title="Water">
          <GaugeList gauges={gauges.water} slug={"water"} parentHandleStateChange={this.handleStateChange} />
        </Tab>
        <Tab eventKey={3} title="Stream">
          <GaugeList gauges={gauges.stream} slug={"stream"} parentHandleStateChange={this.handleStateChange} />
        </Tab>
        <Tab eventKey={4} title="Weather">
          <GaugeList gauges={gauges.weather} slug={"weather"} parentHandleStateChange={this.handleStateChange} />
        </Tab>
      </Tabs>
    );
  }
});
module.exports = Gauges;

var GaugeList = React.createClass({
  handleStateChange: function(gaugeUpdateCommand) {
    var updateCommand = {};
    updateCommand[this.props.slug] = gaugeUpdateCommand;
    this.props.parentHandleStateChange(updateCommand);
  },
  render: function() {
    var gauges = this.props.gauges;
    var handleStateChange = this.handleStateChange;
    var createRow = function(key) {
      return (
        // TODO: figure out key= thing. allow deletion etc.
        <Gauge key={key} slug={key} gauge={gauges[key]} parentHandleStateChange={handleStateChange} />
      );
    };
    return (
      <Grid fluid={true}>
        {Object.keys(gauges).map(createRow)}
      </Grid>
    );
  }
});

var LinkedStateMixin = require('react-addons-linked-state-mixin');
var Gauge = React.createClass({
  mixins: [LinkedStateMixin],
  getInitialState: function() {
    return { editing: false };
  },
  toEditMode: function() {
    this.setState({
      editing: true,
      title: this.props.gauge.title,
      gaugeId: this.props.gauge.gaugeId,
      height: this.props.gauge.height,
      text: this.props.gauge.text,
      link: this.props.gauge.link,
      buildingdash: this.props.gauge.buildingdash,
    });
  },
  saveChanges: function() {
    var updateCommand = {};
    updateCommand[this.props.slug] = {
      title: { $set: this.state.title },
      gaugeId: { $set: this.state.gaugeId },
      height: { $set: parseInt(this.state.height) },
      text: { $set: this.state.text },
      link: { $set: this.state.link },
      buildingdash: { $set: this.state.buildingdash }
    };
    this.props.parentHandleStateChange(updateCommand);
    this.setState({ editing: false });
  },
  render: function() {
    if (this.state.editing === false) {
      var titleBar = (
        <span>
          {this.props.gauge.title} <Button onClick={this.toEditMode} >Edit</Button>
        </span>
      );
      return (
        <Panel header={titleBar}>
          <Grid>
            <Col md={4}>
              <iframe src={'http://www.buildingos.com/blocks/'+this.props.gauge.gaugeId+'/'} frameBorder={0} height={this.props.gauge.height} scrolling="no" width="286"></iframe>
            </Col>
            <Col md={8}>
              <Row>
                <Col md={2}><b>Gauge ID:</b></Col>
                <Col md={6}>{this.props.gauge.gaugeId}</Col>
              </Row>
              <Row>
                <Col md={2}><b>Height:</b></Col>
                <Col md={6}>{this.props.gauge.height}</Col>
              </Row>
              <Row>
                <Col md={2}><b>Description:</b></Col>
                <Col md={6}>{this.props.gauge.text}</Col>
              </Row>
              <Row>
                <Col md={2}><b>Link for more info:</b></Col>
                <Col md={6}>{this.props.gauge.link}</Col>
              </Row>
              <Row>
                <Col md={2}><b>Link to building dashboard page:</b></Col>
                <Col md={6}>{this.props.gauge.buildingdash}</Col>
              </Row>
            </Col>
          </Grid>
        </Panel>
      );
    } else {
      return (
        <Well md={6}>
          <Row>
            <Col md={10}>
              <Input type="text" bsSize="large" placeholder="Readable Title"
                     valueLink={this.linkState('title')} />
            </Col>
            <Col md={1}><Button onClick={this.saveChanges} >Save</Button></Col>
          </Row>
          <Row>
            <Col md={6}>
              <Input type="text" label="Gauge ID" valueLink={this.linkState('gaugeId')}
                     help="buildingos.com/blocks/XX/" />
            </Col>
            <Col md={6}>
              <Input type="text" label="Height"
                      help="Dynamically adjusted height for gauges is a feature in progress."
                      valueLink={this.linkState('height')} />
            </Col>
          </Row>
          <Row>
            <Input type="textarea" label="Description" valueLink={this.linkState('text')} />
          </Row>
          <Row>
            <Col md={6}>
              <Input type="text" label="Link for more info" valueLink={this.linkState('link')} />
            </Col>
            <Col md={6}>
              <Input type="text" label="Link to building dashboard page"
                     valueLink={this.linkState('buildingdash')} />
            </Col>
          </Row>
        </Well>
      );
    }
  }
});
