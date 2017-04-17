const config = require('./config.json');

const Slack = require('node-slack');
const slack = new Slack(config.notify.slack);

module.exports = {
  sendMessage: function(message, channel, username) {
    if (!message){
      console.log('Error: No message sent. You must define a message.');
      return;
    }
    else {
      // set defaults if username or channel is not passed in
      var channel = (typeof channel !== 'undefined') ? channel : "#notifications";
      var username = (typeof username !== 'undefined') ? username : "MyApp";
      // send the Slack message
      slack.send({
        text: message,
        channel: channel,
        username: username
      });
      return;
    }
  }
};