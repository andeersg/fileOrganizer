exports.match = function(filename) {
  const pattern = /^([a-zA-Z0-9. ]+)S([0-9]+)E([0-9]+)(.+)/;

  if (filename.match(pattern)) {
    return true;
  }
  return false;
}