#!/usr/bin/env node

var http = require('axios');
const cheerio = require('cheerio');
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
    return `${pre}-${cur}`;
})


http.get('http://dictionary.cambridge.org/dictionary/english/' + inputText)
    .then(data => {
        const $ = cheerio.load(data.data);
        var spells = [];
        $('.pron-info').each((id, el) => {
            spells[id] = $(el).text().replace("​\n\t\t\t", "").replace('  ', "");
        })
        if (spells.length !== 0)
            console.log(colors.yellow(spells));
        var defs = [];
        $('.def').each((id, el) => {
            defs[id] = $(el).text();
        })
        if (defs.length == 0) {
            console.log(colors.red("nil"))
            return
        }
        if (defs.length > 4) defs = defs.slice(0, 3);
        defs.forEach((v, i) => {
            console.log(colors.blue(++i + '. ' + v))
        })
        var exs = [];
        $('.examp.emphasized').each((id, el) => {
            exs[id] = $(el).text()
        });
        if (exs.length > 4) exs = exs.slice(0, 3);
        if (exs.length > 0) console.log("examples:")
        exs.forEach((v, i) => {
            console.log('\t -' + colors.green(v))
        })
    })