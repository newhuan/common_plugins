let fs = require('fs');
let path = require('path');
let os = require('os');
//modules from npm install
let express = require('express');
let bodyParser = require('body-parser');

let interfaces = os.networkInterfaces();
let addresses = [];
for (let k in interfaces) {
    for (let k2 in interfaces[k]) {
        let address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}
let localhost = addresses[0];

let app = express();
app.set( 'port', ( 3030 ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( '/', express.static( path.join( __dirname, 'public' ) ) );
// Additional middleware which will set headers that we need on each request.
app.use( function ( req, res, next ) {
    next();
} );

app.listen( 3030, function () {
    console.log('Server started: http://' + localhost +':' + app.get('port') + '/');
});

app.get('/hw', function (req, res) {
  res.send('Hello World!')
});

//phantom
(async function () {
    const phantom = require('phantom');
    const root = "http://" + localhost + ":" + app.get( 'port' ) + "/";
    console.log( root );
    const instance = await phantom.create(['--ignore-ssl-errors=yes', '--load-images=no']);
    const page = await instance.createPage();
    await page.on('onResourceRequested', function (requestData) {
        console.info('Requesting', requestData.url);
    });
    page.property( 'viewportSize' , { width: 1600, height: 10000, } );
    await page.on('onResourceRequested', function (requestData) {
        // console.info('Requesting', requestData.url);
    });
    await page.on('onConsoleMessage', function (msg) {
        console.log( msg );
    });
    await page.open( root + "index.html?seq=0" );
    console.log( root + "index.html?seq=0" );
})();







