var React = require('react/addons');
import { Input, Grid, Row, Col, Well, Tabs, Tab } from 'react-bootstrap';

var Gauges = React.createClass({
  render: function() {
    var gauges = this.props.gauges;
    return (
      <Tabs defaultActiveKey={1} position="left" animation={false}>
        <Tab eventKey={1} title="Electricity">
          <GaugeList gauges={gauges.electricity} type="intro" />
        </Tab>
        <Tab eventKey={2} title="Water">
          <GaugeList gauges={gauges.water} type="intro" />
        </Tab>
        <Tab eventKey={3} title="Stream">
          <GaugeList gauges={gauges.stream} type="intro" />
        </Tab>
        <Tab eventKey={4} title="Weather">
          <GaugeList gauges={gauges.weather} type="intro" />
        </Tab>
      </Tabs>
    );
  }
});
module.exports = Gauges;

var GaugeList = React.createClass({
  render: function() {
    var gauges = this.props.gauges;
    var createRow = function(key) {
      return (
        // TODO: figure out key= thing. allow deletion etc.
        <Gauge key={key} slug={key} gauge={gauges[key]} />
      );
    };
    return (
      <Grid fluid="true">
        {Object.keys(gauges).map(createRow)}
      </Grid>
    );
  }
});

var Gauge = React.createClass({
  render: function() {
    // TODO: interface for editing all this
    return (
      <Well md={6}>
        <Row>
          <Input type="text" bsSize="large" placeholder="Readable Title"
                 value={this.props.gauge.title} />
        </Row>
        <Row>
          <Col md={6}>
            <Input type="text" label="Gauge ID" value={this.props.gauge.gaugeId}
                   help="buildingos.com/blocks/XX/" />
          </Col>
          <Col md={6}>
            <Input type="text" label="Height"
                    help="Dynamically adjusted height for gauges is a feature in progress."
                    value={this.props.gauge.height} />
          </Col>
        </Row>
        <Row>
          <Input type="textarea" label="Description" value={this.props.gauge.text} />
        </Row>
        <Row>
          <Col md={6}>
            <Input type="text" label="Link for more info" value={this.props.gauge.link} />
          </Col>
          <Col md={6}>
            <Input type="text" label="Link to building dashboard page"
                   value={this.props.gauge.buildingdash} />
          </Col>
        </Row>
      </Well>
    );
  }
});
