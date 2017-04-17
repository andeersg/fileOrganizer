const fs = require('fs');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const debug = require('debug')('app');

app.use(express.static('public'));

// Plugins
const tvShowRenameMover = require('./plugins/tvShowRenameMover');

const config = require('./config.json');

// Display web interface to manually do stuff.
app.get('/', function (req, res) {
  res.send('index.html');
})
http.listen(3000, function () {
  debug('Starting app');

  // @TODO This should be configurable from interface.
  // Maybe use a sqlite database.
  var checkInterval = 1000 * 60 * 60;

  // @TODO Could extend it to a loading system where each plugin specifies their interval.
  // @NOTE On top level we could send in the IO object, and let the modules them selves do emitting and such.
  var tvRenamerInProgress = false;
  setInterval(function() {
    if (tvRenamerInProgress) {
     // tvRenamerInProgress = true;
     // tvShowRenameMover(config.tvSeries, function(error) {
     //   tvRenamerInProgress = false;
     // });
    }
  }, checkInterval);
  
  tvRenamerInProgress = true;
  console.log('Run tvShowRenameMover function');
  tvShowRenameMover(config.tvSeries, function(error) {
    tvRenamerInProgress = false;
  });
});
