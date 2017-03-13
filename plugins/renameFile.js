const request = require('request');
const debug = require('debug')('rename');
const pattern = /^([a-zA-Z0-9. ]+)S([0-9]+)E([0-9]+)(.+)\.([a-zA-Z0-9]+)$/;

module.exports = function(file) {
  return new Promise(function(resolve, reject) {
    // Desired output should be an addition to the object.
    // file.outputName = 'Pretty name of show - S01E01.mkv';
    // file.outputPath = 'Pretty name of show/Season 01/Pretty name of show - S01E01.mkv';
    var match = file.matchedName.match(pattern);
    if (match) {
      // Build output.
      file.data.showName = match[1];
      file.data.season = match[2];
      file.data.episode = match[3];
      file.data.extension = match[5];
      
      // Either this will work:
      lookupAPI(file).then(function(file) {
        // file.outputName = 'Pretty name of show - S01E01.mkv';
        // file.outputPath = 'Pretty name of show/Season 01/Pretty name of show - S01E01.mkv';
        file.outputName = file.data.showName + ' - S' + file.data.season + 'E' + file.data.episode + '.' + file.data.extension;
        file.outputPath = file.data.showName + '/Season ' + file.data.season + '/' + file.outputName;

        debug('Matched and all is good: ' + file.matchedName);
        resolve(file);
      });

      // Or we should return the function.
      // return lookupAPI(file);
    }
    else {
      // Manual mode?
      file.manual = true;
      debug('Manual mode for ' + file.matchedName);
      resolve(file);
    }
  });
}


// name: 1,
// season: 2,
// episode: 3,
// extension: 5

var lookupAPI = function(file) {
  var title = file.data.showName.replace(/_/g, ' ').replace(/\./g, ' ').replace(/ +$/, '');
  var encodedTitle = encodeURIComponent(title);

  return new Promise(function(resolve, reject) {
    request('http://api.tvmaze.com/search/shows?q=' + encodedTitle, function(err, response, body) {
      if (err) {
        return reject(err);
      }

      var data = JSON.parse(body);
      if (!data.length) {
        // Return false.
        debug('No API results for: ' + file.matchedName);
        file.manual = true;
        resolve(file);
      }
      else if (data.length == 1) {
        // Awesome, this has to be it.
        debug('API found it: ' + file.matchedName);
        file.data.showName = data[0].show.name;
        resolve(file);
      }
      else {
        // Just take the first one.
        debug('More than one: ' + file.matchedName);
        file.data.showName = data[0].show.name;
        resolve(file);
      }
    });
  });
}