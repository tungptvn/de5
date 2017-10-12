#!/usr/bin/env node

var http = require('axios');
const cheerio = require('cheerio');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var colors = require('colors');
var Speaker = require('./speacker');

const readline = require('readline')
console.log('type any word to show define')
console.log('type `help` to show help')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '_> '
});

rl.prompt();
var ENABLE_SPEAKER = false
var ENABLE_SPEAKER_UK = false
rl.on('line', (line) => {
    var word = line.trim().toLowerCase()
    switch (word) {
        case 'help':
            console.log(`\n exit \t exit application` +
                `\n !sp \t enable or disable the Speaker` +
                `\n !spul \t enable or disable the Speaker (required enable the Speaker)`)
            break

        case 'exit':
            rl.close();
            break;
        case '!sp':
            ENABLE_SPEAKER = !ENABLE_SPEAKER
            console.log('ENABLE_SPEAKER : ', ENABLE_SPEAKER)
            break
        case '!spuk':
            ENABLE_SPEAKER_UK = !ENABLE_SPEAKER_UK
            console.log('ENABLE_SPEAKER_UK', ENABLE_SPEAKER_UK)
            break

        default:
            doLook(word)
            break;
    }
    rl.prompt();
}).on('close', () => {
    console.log('Have a great day!');
    process.exit(0);
});


doLook = function (inputText) {
    http.get('http://dictionary.cambridge.org/dictionary/english/' + inputText)
        .then(data => {
            const $ = cheerio.load(data.data);
            var pos = [];
            $('.posgram').each((id, el) => {
                pos[id] = $(el).text();
            })
            if (pos.length > 0) console.log(('[Gra] \t') + colors.yellow(pos.filter((v, i, a) => a.indexOf(v) === i)));
            var spells = [];
            $('.pron-info').each((id, el) => {
                spells[id] = $(el).text().replace("​\n\t\t\t", "").replace('  ', "");
            })
            if (spells.length !== 0)
                console.log('[Pro] \t' + colors.yellow(spells.filter((v, i, a) => a.indexOf(v) === i)));
            var defs = [];
            $('.def').each((id, el) => {
                defs[id] = $(el).text();
            })
            if (defs.length == 0) {
                console.log(colors.red("nil"))
                return
            }
            if (defs.length > 4) defs = defs.slice(0, 3);
            let strDef = "";
            defs.forEach((v, i) => {
                strDef += colors.green('\t' + ++i + '. ' + v + ((i !== (defs.length)) ? '\n' : ''));
            })
            if (defs.length > 0) console.log("[Def]" + strDef);


            var exs = [];
            $('.examp.emphasized').each((id, el) => {
                exs[id] = $(el).text()
            });
            if (exs.length > 4) exs = exs.slice(0, 3);
            let strExs = "";
            exs.forEach((v, i) => {
                strExs += colors.green('\t' + ++i + '. ' + v + ((i !== (exs.length)) ? '\n' : ''));
            })
            if (exs.length > 0) console.log("[Exs]" + strExs);

            if (ENABLE_SPEAKER) {
                if (ENABLE_SPEAKER_UK) {
                    var mp3UrlUS = $('.audio_play_button', '.uk').attr('data-src-mp3');
                    if (mp3UrlUS) {
                        var sp = new Speaker(mp3UrlUS);
                        sp.play();
                        return;
                    }

                } else {
                    var mp3UrlUS = $('.audio_play_button', '.us').attr('data-src-mp3');
                    if (mp3UrlUS) {
                        var sp = new Speaker(mp3UrlUS);
                        sp.play();
                    }
                }

            }

        })
}