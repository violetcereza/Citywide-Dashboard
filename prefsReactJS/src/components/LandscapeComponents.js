import React from 'react';
import { Input, Grid, Row, Col, Well, Button, Panel } from 'react-bootstrap';

// TODO: consider changing language away from "landscape components"
// bc it's confusing. Maybe use "landmark?"
var LandscapeComponents = React.createClass({
  handleStateChange: function(landscapeUpdateCommand) {
    var updateCommand = {};
    updateCommand.landscape = landscapeUpdateCommand;
    this.props.parentHandleStateChange(updateCommand);
    console.log(updateCommand);
  },
  render: function() {
    var components = this.props.components;
    var handleStateChange = this.handleStateChange;
    var createRow = function(key) {
      return (
        // TODO: figure out key= thing. allow deletion etc.
        <LandscapeComponent key={key} slug={key} component={components[key]} parentHandleStateChange={handleStateChange} />
      );
    };
    return (
      <div>
        {Object.keys(components).map(createRow)}
      </div>
    );
  }
});
module.exports = LandscapeComponents;

var LinkedStateMixin = require('react-addons-linked-state-mixin');
var LandscapeComponent = React.createClass({
  mixins: [LinkedStateMixin],
  getInitialState: function() {
    return { editing: false };
  },
  toEditMode: function() {
    this.setState({
      editing: true,
      title: this.props.component.title,
      slug: this.props.slug,
      image: this.props.component.image,
      link: this.props.component.link,
      imageWidth: this.props.component.imageWidth,
      imageHeight: this.props.component.imageHeight,
      imageXOffset: this.props.component.imageXOffset,
      imageYOffset: this.props.component.imageYOffset,
      text: this.props.component.text
    });
  },
  saveChanges: function() {
    // TODO
    var updateCommand = {};
    updateCommand[this.props.slug] = {
      title: { $set: this.state.title },
      // TODO: how to change slug? Maybe we should change around the whole datastructure.
      // slug: this.props.slug,
      image: { $set: this.state.image },
      link: { $set: this.state.link },
      imageWidth: { $set: this.state.imageWidth },
      imageHeight: { $set: this.state.imageHeight },
      imageXOffset: { $set: this.state.imageXOffset },
      imageYOffset: { $set: this.state.imageYOffset },
      text: { $set: this.state.text }
    };
    this.props.parentHandleStateChange(updateCommand);
    this.setState({ editing: false });
  },
  render: function() {
    if (this.state.editing === false) {
      var titleBar = (
        <span>
          {this.props.component.title} <Button onClick={this.toEditMode} >Edit</Button>
        </span>
      );
      return (
        <Panel header={titleBar}>
          <Grid>
            <Row>
              <Col md={3}><b>Slug:</b></Col>
              <Col md={8}>{this.props.slug}</Col>
            </Row>
            <Row>
              <Col md={3}><b>Link:</b></Col>
              <Col md={8}>{this.props.component.link}</Col>
            </Row>
            <Row>
              <Col md={3}><b>Descriptive Text:</b></Col>
              <Col md={8}>{this.props.component.text}</Col>
            </Row>
            <Row>
              <Col md={3}><b>Custom Image URL:</b></Col>
              <Col md={8}>{this.props.component.image}</Col>
            </Row>
            <Row>
              <Col md={3}><b>Image Dimensions:</b></Col>
              <Col md={8}>{this.props.component.imageWidth}x{this.props.component.imageHeight}</Col>
            </Row>
            <Row>
              <Col md={3}><b>Image Offset:</b></Col>
              <Col md={8}>({this.props.component.imageXOffset}, {this.props.component.imageYOffset})</Col>
            </Row>
          </Grid>
        </Panel>
      );
    } else {
      return (
        <Well md={6}>
          <Row>
            <Col md={6}>
              <Input type="text" bsSize="large" placeholder="Readable Title"
                     valueLink={this.linkState('title')} />
            </Col>
            <Col md={6}><Button onClick={this.saveChanges} >Save</Button></Col>
          </Row>
          <Row>
            <Col md={4}>
              <Input type="text" label="Component Slug" valueLink={this.linkState('slug')}
                     help="This is the id of the image in the svg file that this landmark is linked to." />
            </Col>
            <Col md={4}>
              <Input type="text" label="Image URL"
                      help="If blank, default image will be used."
                      valueLink={this.linkState('image')} />
            </Col>
            <Col md={4}>
              <Input type="text" label="Link" valueLink={this.linkState('link')} />
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <Input type="text" label="Custom Image Width"
                     valueLink={this.linkState('imageWidth')} />
            </Col>
            <Col md={3}>
              <Input type="text" label="Custom Image Height"
                     valueLink={this.linkState('imageHeight')} />
            </Col>
            <Col md={3}>
              <Input type="text" label="Custom Image X Position Offset"
                     valueLink={this.linkState('imageXOffset')} />
            </Col>
            <Col md={3}>
              <Input type="text" label="Custom Image Y Position Offset"
                     valueLink={this.linkState('imageYOffset')} />
            </Col>
          </Row>
          <Row>
            <Input type="textarea" label="Text" valueLink={this.linkState('text')} />
          </Row>
        </Well>
      );
    }
  }
});
