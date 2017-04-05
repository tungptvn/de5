const translate = require('google-translate-api');
var exec = require('child_process').exec
var spawn = require('child_process').spawn
var colors = require('colors');
if (process.argv.length < 2) {
    console.log(colors.yellow("pls input some text"));
    return;
}
switch (process.argv[2]) {
    case "o":
        var query = process.argv.slice(2).reduce((pre, cur, curIndex, arr) => {
            return `${pre} ${cur}`;
        })
        query = encodeURI(query);
        var url = `https://www.google.com/search?q=${query}`;
        openURL(url)
        break;

    
}

function openURL(url) {
    switch (process.platform) {
        case "darwin":
            exec('open ' + url)
            break;
        case "win32":
            exec('start ' + url)
            break;
        default:
            spawn('xdg-open', [url])
    }
}
var inputText = process.argv.slice(2).reduce((pre, cur, curIndex, arr) => {
    return `${pre} ${cur}`;
})

translate(inputText, {
    to: 'vi',
    raw: true
}).then(res => {
    var spell = "";
    if (process.argv.length == 2) {
        const regex = /\[,,,"([^"]+)"/gu;
        spell = res.raw.match(regex);
        spell = spell.toString().replace("[,,,", '').replace("'", '');
        console.log(colors.grey(spell) + ': ' + colors.green(res.text));
        return;
    }
    console.log(colors.green(res.text));
    // console.log(res.raw);
}).catch(err => {
    console.error(err);
});

