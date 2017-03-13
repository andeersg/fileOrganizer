// Load config to know path. Or send it in as a argument.
var fileExt = /(?:\.([^.]+))?$/;
const fs = require('fs');
const debug = require('debug')('analyzeFile');

const mediaExtensions = [
  'mkv',
  'avi',
  'mp4',
];


module.exports = function(filename, path) {
  let fileObject = {
    matchedName: filename,
    orignalPath: path,
    manual: false,
    data: {},
    cleanUp: []
  };

  return new Promise(function(resolve, reject) {
    var stats = fs.lstatSync(path + '/' + filename);
    if (stats.isDirectory()) {
      // Look for a media file inside.
      var mediaFile = scanFolderForMedia(path + '/' + filename);
      if (mediaFile) {
        fileObject.matchedName = mediaFile;
        fileObject.orignalPath = fileObject.orignalPath + '/' + filename;
        fileObject.cleanUp.push(fileObject.orignalPath);
      }
      else {
        // Manuel mode!
        fileObject.manual = true;
      }
    }
    else if (matchMedia(filename)) {
      // We are good to go.
    }
    else {
      // Not a folder, and not a media file. Mark it for manual processing?
      fileObject.manual = true;
    }
    debug('Analyzing: ' + fileObject.matchedName);
    resolve(fileObject);
  });
}

var scanFolderForMedia = function(folder) {
  var files = fs.readdirSync(folder, 'utf8');
  var mediaFiles = files.filter(matchMedia);
  debug('Mediafiles length for ' + file.matchedName + ' is: ' + mediaFiles.length);
  if (mediaFiles.length == 1) {
    return mediaFiles[0];
  }
  else {
    // What should we do?
    // Return false and do a manual handling??
    return false;
  }
}

var matchMedia = function(name) {
  if (mediaExtensions.indexOf(name.match(fileExt)[1]) > -1) {
    return true;
  }
  return false;
}