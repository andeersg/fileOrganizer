const fs = require('fs');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const debug = require('debug')('app');

app.use(express.static('public'));

// Plugins
const tvShowRenameMover = require('./plugins/tvShowRenameMover');

const config = {
  source: '/Users/anders.grendstadbakk/Projects/node/seriesRenamer/samples',
  destination: '/Users/anders.grendstadbakk/Projects/node/seriesRenamer/sample_destination',
};

// Display web interface to manually do stuff.
app.get('/', function (req, res) {
  res.send('index.html');
})
http.listen(3000, function () {
  debug('Starting app');

  // @TODO This should be configurable from interface.
  // Maybe use a sqlite database.
  var checkInterval = 1000 * 60 * 1;

  // @TODO Could extend it to a loading system where each plugin specifies their interval.
  setInterval(function() {
    tvShowRenameMover(config);
  }, checkInterval);
});
