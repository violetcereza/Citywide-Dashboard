var React = require('react/addons');
import { Input, Grid, Row, Col, Well } from 'react-bootstrap';

var LandscapeComponents = React.createClass({
  render: function() {
    var components = this.props.components;
    var createRow = function(key) {
      return (
        // TODO: figure out key= thing. allow deletion etc.
        <LandscapeComponent key={key} slug={key} component={components[key]} />
      );
    };
    return (
      <Grid>
        {Object.keys(components).map(createRow)}
      </Grid>
    );
  }
});
module.exports = LandscapeComponents;

var LandscapeComponent = React.createClass({
  render: function() {
    // TODO: interface for editing all this
    return (
      <Well md={6}>
        <Row>
          <Input type="text" bsSize="large" placeholder="Readable Title"
                 value={this.props.component.title} />
        </Row>
        <Row>
          <Col md={4}>
            <Input type="text" label="Component Slug" value={this.props.slug} />
          </Col>
          <Col md={4}>
            <Input type="text" label="Image URL"
                    help="If blank, default image will be used."
                    value={this.props.component.image} />
          </Col>
          <Col md={4}>
            <Input type="text" label="Link" value={this.props.component.link} />
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <Input type="text" label="Custom Image Width"
                   value={this.props.component.imageWidth} />
          </Col>
          <Col md={3}>
            <Input type="text" label="Custom Image Height"
                   value={this.props.component.imageHeight} />
          </Col>
          <Col md={3}>
            <Input type="text" label="Custom Image X Position Offset"
                   value={this.props.component.imageXOffset} />
          </Col>
          <Col md={3}>
            <Input type="text" label="Custom Image Y Position Offset"
                   value={this.props.component.imageYOffset} />
          </Col>
        </Row>
        <Row>
          <Input type="textarea" label="Text" value={this.props.component.text} />
        </Row>
      </Well>
    );
  }
});
