const express = require('express');
const path = require('path');


const https = require('https');
const fs = require('fs');
const options = {
  servername: 'cts.sosprestige.com',
  key : fs.readFileSync('private.key'),
  cert : fs.readFileSync('certificate.crt'),
  ca : fs.readFileSync('ca_bundle.crt')
};



const app = express();

app.use(express.static(__dirname + '/dist'));
app.get('/*', function(req,res) {
 	res.sendFile(path.join(__dirname + '/dist/index.html'));
});

https.createServer(options, app).listen(443);

