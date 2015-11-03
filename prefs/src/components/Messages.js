var React = require('react/addons');
//var update = require('react-addons-update');
import { Input, Tabs, Tab, Table, Button } from 'react-bootstrap';

var Messages = React.createClass({
  handleStateChange: function(sectionUpdateCommand) {
    // var updateCommand = {
    //   'messageSections': {
    //     rowSection: {
    //       rowIndex: {
    //         $set: new
    //       }
    //     }
    //   }
    // };
    var updateCommand = {};
    updateCommand.messageSections = sectionUpdateCommand;
    this.props.parentHandleStateChange(updateCommand);
    // updateCommand[rowSection][rowState.index] = {
    //   text: {
    //     $set: event.target.value
    //   }
    // };
    // this.props.stateStore.setState(React.addons.update(this.props.stateStore.state, updateCommand));
  },
  render: function() {
    return (
      <Tabs defaultActiveKey={1} position="left" tabWidth={2} animation={false}>
        <Tab eventKey={1} title="Introduction Narration">
          <MessageTable parentHandleStateChange={this.handleStateChange} stateStore={this.props.stateStore} section={0} messages={this.props.messages[0]} type="intro" />
        </Tab>
        <Tab eventKey={2} title="Resource Category">
          <MessageStateSelector section={1} messages={this.props.messages[1]} type="intro" />
        </Tab>
        <Tab eventKey={3} title="Resource Explanation">
          <MessageStateSelector section={2} messages={this.props.messages[2]} type="intro" />
        </Tab>
        <Tab eventKey={4} title="Level Narration">
          <MessageStateSelector section={3} messages={this.props.messages[3]} type="intro" />
        </Tab>
        <Tab eventKey={5} title="Conservation Suggestion">
          <MessageStateSelector section={4} messages={this.props.messages[4]} type="intro" />
        </Tab>
      </Tabs>
    );
  }
});
module.exports = Messages;

var MessageTable = React.createClass({
  handleStateChange: function(rowUpdateCommand) {
    // var rowUpdateCommand = {
    //   rowIndex: {
    //     $set: new
    //   }
    // };
    var updateCommand = {};
    updateCommand[this.props.section] = rowUpdateCommand;
    this.props.parentHandleStateChange(updateCommand);
    // updateCommand[rowSection][rowState.index] = {
    //   text: {
    //     $set: event.target.value
    //   }
    // };
    // this.props.stateStore.setState(React.addons.update(this.props.stateStore.state, updateCommand));
  },
  render: function() {
    var messageTable = this;
    var createRow = function(message, index) {
      return (
        <MessageRow key={message.key || index} index={message.key || index} parentHandleStateChange={messageTable.handleStateChange} probability={message.probability} text={message.text} />
      );
    };
    return (
      <Table striped>
        <thead>
          <tr>
            <th className="col-xs-1" >Prob</th>
            <th>Message Text</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {this.props.messages.map(createRow)}
        </tbody>
      </Table>
    );
  }
});

var MessageStateSelector = React.createClass({
  render: function() {
    var allMessages = this.props.messages;
    var filterToState = function(state) {
      return allMessages.filter(function(message) {
        return message.state === state;
      });
    };
    return (
      <Tabs defaultActiveKey={1} position="top" animation={false}>
        <Tab eventKey={1} title="Electricity">
          <MessageTable messages={filterToState('electricity')} type="intro" />
        </Tab>
        <Tab eventKey={2} title="Water">
          <MessageTable messages={filterToState('water')} type="intro" />
        </Tab>
        <Tab eventKey={3} title="Stream">
          <MessageTable messages={filterToState('stream')} type="intro" />
        </Tab>
        <Tab eventKey={4} title="Weather">
          <MessageTable messages={filterToState('weather')} type="intro" />
        </Tab>
      </Tabs>
    );
  }
});

var LinkedStateMixin = require('react-addons-linked-state-mixin');
var MessageRow = React.createClass({
  mixins: [LinkedStateMixin],
  getInitialState: function() {
    return { editing: false };
  },
  toEditMode: function() {
    this.setState({
      editing: true,
      probability: this.props.probability,
      text: this.props.text
    });
  },
  saveChanges: function() {
    // var rowUpdateCommand = {
    //   rowIndex: {
    //     $set: new
    //   }
    // };
    var updateCommand = {};
    updateCommand[this.props.index] = {
      probability: { $set: this.state.probability },
      text: { $set: this.state.text }
    };
    this.props.parentHandleStateChange(updateCommand);
    this.setState({ editing: false });
  },
  render: function() {
    if (this.state.editing === false) {
      return (
        // TODO: figure out key= thing. allow deletion etc.
        <tr key={this.props.key}>
          <td><MessageProbabilityText probability={this.props.probability} /></td>
          <td>{this.props.text}</td>
          <td><Button onClick={this.toEditMode} >Edit</Button></td>
        </tr>
      );
    } else {
      //<td><Input value={this.state.text} onChange={null} type="textarea" placeholder="Message Text" /></td>
      return (
        <tr key={this.props.key}>
          <td><MessageProbabilityField probability={this.state.probability} /></td>
          <td><textarea style={{width: "100%"}} valueLink={this.linkState('text')} /></td>
          <td><Button onClick={this.saveChanges} >Save</Button></td>
        </tr>
      );
    }
  }
});

var MessageProbabilityText = React.createClass({
  render: function() {
    var probability = this.props.probability;
    if (isNaN(probability)) {
      var string = '';
      for(var key in probability) {
        string += probability[key] + ', ';
      }
      return (
        <span>{ string.slice(0, -2) }</span>
      );
    } else {
      return (
        <span>{ this.props.probability }</span>
      );
    }
  }
});

var MessageProbabilityField = React.createClass({
  render: function() {
    var probability = this.props.probability;
    if (isNaN(probability)) {
      var inputs = [];
      for(var key in probability) {
        inputs.push(
          <input bsSize="small" type="text" value={probability[key]} />
        );
      }
      return (
        <div>
          { inputs }
        </div>
      );
    } else {
      return (
        <Input type="text" placeholder="Probability" value={probability} />
      );
    }
  }
});
