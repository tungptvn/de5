const path = require('path');
const cmdAsync = require('./spawn-async');

function Speaker(options) {
  var seft = this;
  if (typeof (options) == "string") {
    seft.location = options;
  }

}
Speaker.prototype.play = function () {
  return cmdAsync('mplayer', [this.location], {
    cwd: path.join(__dirname, 'tools/mplayer')
  })
}

module.exports = Speaker;