const spawn = require('child_process').spawn;
module.exports = function (cmd, args, opts) {
    opts = opts || {};
    return new Promise((resolve, reject) => {
        const cm = spawn(cmd, args, opts);
        cm.on('error', (err) => {
            reject(err);
        })
        cm.on('close', (code) => {
            resolve(code);
        })
    })

}