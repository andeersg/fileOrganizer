const request = require('request');
const debug = require('debug')('rename');
const pattern = /^([a-zA-Z0-9. ]+)S([0-9]+)E([0-9]+)(.+)\.([a-zA-Z0-9]+)$/;

module.exports = function(file) {
  return new Promise(function(resolve, reject) {
    // Desired output should be an addition to the object.
    // file.outputName = 'Pretty name of show - S01E01.mkv';
    // file.outputPath = 'Pretty name of show/Season 01/Pretty name of show - S01E01.mkv';
    var nameToMatch = '';
    if (file.matchedName !== file.fileName) {
      // We want to rename based on matchedName, but we need extension from fileName.
      var fileExt = /(?:\.([^.]+))?$/;
      var ext = fileExt.exec(file.fileName)[1];
      if (ext) {
        nameToMatch = file.matchedName + '.' + ext;
      }
      debug('We added extension and got: ' + nameToMatch);
    }
    else {
      nameToMatch = file.matchedName;
    }

    var match = nameToMatch.match(pattern);
    resolve(match);

  }).then(function(match) {
    if (match) {
      // Build output.
      file.data.showName = match[1];
      file.data.season = match[2];
      file.data.episode = match[3];
      file.data.extension = match[5];
      
      // Either this will work:
      return lookupAPI(file).then(function(file) {
        // file.outputName = 'Pretty name of show - S01E01.mkv';
        // file.outputPath = 'Pretty name of show/Season 01/Pretty name of show - S01E01.mkv';
        file.outputName = file.data.showName + ' - S' + file.data.season + 'E' + file.data.episode + '.' + file.data.extension;
        file.outputPath = file.data.showName + '/Season ' + file.data.season + '/' + file.outputName;

        return file;
      });

      // Or we should return the function.
      // return lookupAPI(file);
    }
    else {
      // Manual mode?
      file.manual = true;
      return file;
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
        file.manual = true;
        resolve(file);
      }
      else if (data.length == 1) {
        // Awesome, this has to be it.
        file.data.showName = data[0].show.name;
        resolve(file);
      }
      else {
        // Just take the first one.
        file.data.showName = data[0].show.name;
        resolve(file);
      }
    });
  });
}