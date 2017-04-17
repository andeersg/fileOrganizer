const fs = require('fs');
const path = require('path');
const matchFilename = require('./matchFilename');
const analyzeFile = require('./analyzeFile');
const renameFile = require('./renameFile');
const moveFile = require('./moveFile');
const Datastore = require('nedb');

var db = new Datastore({
  filename: path.resolve(__dirname, './data/tvshow.db'), // Provide a path to the database file.
  autoload: true, // Automatically load the database.
  timestampData: true // Add and manage the fields createdAt and updatedAt.
});

module.exports = function(settings, cb) {
  var files = fs.readdirSync(settings.source, 'utf8');

  files = files.filter((filename) => filename.substr(0, 1) == '.' ? false : true);
  files = files.filter(matchFilename.match);

  // files = files.slice(0, 10);

  // All files should be ok now. // matchedName
  let fileProcesses = [];

  // Loop.
  files.forEach(function(filename) {
    db.findOne({matchedName: filename}, function(err, file) {
      if (file) {
        // Already been here, skip it.
        console.log('Skipping ', filename, ', processed already.');
      }
      else {
        var fileProcess = analyzeFile(filename, settings.source)
        .then(renameFile)
        .then(function(file) {
          if (file.manual) {
            // Return what ever we need to do.
            db.insert(file, function(err, goal) {
              return file;
            });
          }
          else {
            return moveFile(file, settings);
            // Do we need a then to do something special if moved = false.
          }
        });
        fileProcesses.push(fileProcess);
      }
    });
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
