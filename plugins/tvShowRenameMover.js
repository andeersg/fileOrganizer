const fs = require('fs');
const matchFilename = require('./matchFilename');
const analyzeFile = require('./analyzeFile');
const renameFile = require('./renameFile');
const moveFile = require('./moveFile');

module.exports = function(settings, cb) {
  var files = fs.readdirSync(settings.source, 'utf8');

  files = files.filter((filename) => filename.substr(0, 1) == '.' ? false : true);
  files = files.filter(matchFilename.match);

  // All files should be ok now.
  let fileProcesses = [];

  // Loop.
  files.forEach(function(filename) {
    var fileProcess = analyzeFile(filename, settings.source)
    .then(renameFile)
    .then(function(file) {
      if (file.manual) {
        // Return what ever we need to do.
	return file;
      }
      else {
        return moveFile(file, settings);
        // Do we need a then to do something special if moved = false.
      }
    });

    fileProcesses.push(fileProcess);
  });

  Promise.all(fileProcesses).then(function(results) {
    console.log(JSON.stringify(results));
    console.log('All good for now.');
    cb(null);
  })
  .catch(function(error) {
    console.log(error);
    cb(error);
  });
}
