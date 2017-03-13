const debug = require('debug')('mover');
const mv = require('mv');
const rimraf = require('rimraf');

module.exports = function(file, settings) {
  return new Promise(function(resolve, reject) {
    const from = file.orignalPath + '/' + file.matchedName;
    const to = settings.destination  + '/' + file.outputPath;

    mv(from, to, {mkdirp: true}, function(err) {
      if (err) {
        file.moved = false;
        resolve(file);
      }
      else {
        debug('Moved: ' + file.data.showName);
        file.moved = true;
        if (file.cleanUp.length) {
            rimraf(file.cleanUp[0], function(err) {
              if (err) {
                debug(err);
              }
              else {
                debug('Deleted folder: ' + file.cleanUp[0]);
              }
              resolve(file);
            });
        }
        else {
          resolve(file);
        }
      }
    });
  });
}