var fs = require('fs');
var path = require('path');
var os = require('os');
// let { getARandomMomentFromDatabase, getAutographFromDB, getAvatarFromDB, getNicknameFromDB, getNickAndAvatarFromDB } = require( "./server_functions" );
//modules from npm install
// var express = require('express');
// var bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}
let localhost = addresses[0];

// var app = express();
// app.set('port', (3035));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
// app.use('/', express.static(path.join(__dirname, 'robot-public')));
// // Additional middleware which will set headers that we need on each request.
// app.use(function (req, res, next) {
//     next();
// });
//
// app.listen( app.get('port'), function () {
//     console.log('Server started: http://' + localhost +':' + app.get('port') + '/');
// });

(async () => {
    const browser = await puppeteer.launch( {
        headless: true,
        // dumpio: true,
        args: [ '--no-sandbox', '--disable-setuid-sandbox' ]
    } );
    for( let i = 0; i < 165; ++i ) {
        const page = await browser.newPage();
        await page.goto('http://10.0.0.12:3030/index.html?seq=' + i);
        // await page.screenshot({path: 'example.png'});
        page.on('console', msg => console.log('PAGE LOG:', msg.args[0]._remoteObject ));
        // page.on('console', msg => console.log('PAGE LOG:', ...msg.args ));
        // await page.evaluate(() => console.log(`url is ${location.href}`));
    }
    // await browser.close();
})();