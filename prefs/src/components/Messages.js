var React = require('react/addons');
//var update = require('react-addons-update');
import { Input, Tabs, Tab, Table } from 'react-bootstrap';

var Messages = React.createClass({
  render: function() {
    return (
      <Tabs defaultActiveKey={1} position="left" tabWidth={2} animation={false}>
        <Tab eventKey={1} title="Introduction Narration">
          <MessageTable stateStore={this.props.stateStore} messages={this.props.messages[0]} type="intro" />
        </Tab>
        <Tab eventKey={2} title="Resource Category">
          <MessageStateSelector messages={this.props.messages[1]} type="intro" />
        </Tab>
        <Tab eventKey={3} title="Resource Explanation">
          <MessageStateSelector messages={this.props.messages[2]} type="intro" />
        </Tab>
        <Tab eventKey={4} title="Level Narration">
          <MessageStateSelector messages={this.props.messages[3]} type="intro" />
        </Tab>
        <Tab eventKey={5} title="Conservation Suggestion">
          <MessageStateSelector messages={this.props.messages[4]} type="intro" />
        </Tab>
      </Tabs>
    );
  }
});
module.exports = Messages;

var MessageTable = React.createClass({
  handleChange: function(event) {
    var updateCommand = {
      messageSections: {
        0: {}
      }
    };
    updateCommand.messageSections[0][event.target.index] = {
      text: {
        $set: event.target.value
      }
    };
    console.log(event.target.props);
    console.log(updateCommand);
    this.props.stateStore.setState(React.addons.update(this.props.stateStore.state, updateCommand));
  },
  render: function() {
    var messageTable = this;
    var createRow = function(message, index) {
      return (
        // TODO: make separate class? figure out key= thing. allow deletion etc.
        <tr key={message.key || index}>
          <td><MessageProbabilityField probability={message.probability} /></td>
          <td><Input onChange={messageTable.handleChange} type="textarea" placeholder="Message Text" value={message.text} index={index} /></td>
          <td></td>
        </tr>
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