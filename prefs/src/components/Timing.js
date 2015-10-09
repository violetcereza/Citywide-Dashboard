var React = require('react/addons');
import { Input, Grid, Row, Col } from 'react-bootstrap';

var Timing = React.createClass({
  render: function() {
    return (
      <Grid>
        <Row>
          <Col md={4}><Input type="text"
                label="Seconds for each message section"
                value={this.props.timing.delayBetweenMessages} /></Col>
          <Col md={4}><Input type="text"
                label="Seconds before play mode"
                value={this.props.timing.delayBeforePlayMode} /></Col>
          <Col md={4}><Input type="text"
                label="Seconds on each screen when playing"
                help="Allow enough time for every message section to display!"
                value={this.props.timing.delayWhenPlaying} /></Col>
        </Row>
      </Grid>
    );
  }
});

module.exports = Timing;
