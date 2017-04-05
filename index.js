#!/usr/bin/env node

const translate = require('google-translate-api');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var colors = require('colors');
var args = process.argv;
if (args < 3) {
    console.log(colors.yellow("pls input some text"));
    return;
}
switch (args[2]) {
    case "gg":
        var query = args.slice(3).reduce((pre, cur, curIndex, arr) => {
            return `${pre} ${cur}`;
        })
        query = encodeURI(query);
        var url = `https://www.google.com/search?q=${query}`;
        openURL(url)
        return;
    case "gh":
        exec('npm view ' + args[3], function (err, res) {
            if (err) throw err
            var re = /'(git:|https:|git+https:)\/\/(github\.com\/.*?)(\.git)?'/;
            var match = res.match(re)
            if (match) {
                var url = match[2].replace(/\/issues$/, '')
                openURL('https://' + url)
            } else {
                console.log('Can\'t find a github page for package: ' + colors.yellow(name))
            }
        })
        return;

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
var inputText = args.slice(2).reduce((pre, cur, curIndex, arr) => {
    return `${pre} ${cur}`;
})

translate(inputText, {
    to: 'vi',
    raw: true
}).then(res => {
    var spell = "";
    if (args.length == 3) {
        const regex = /\[,,,"([^"]+)"/gu;
        spell = res.raw.match(regex);
        if (!spell) {
            console.log(colors.blue("nil"));
            return;
        }
        spell = spell.toString().replace("[,,,", '').replace("'", '');
        console.log(colors.magenta(spell) + ': ' + colors.green(res.text));
        return;
    }
    console.log(colors.green(res.text));
    // console.log(res.raw);
}).catch(err => {
    console.error(err);
});