const express = require('express');
const path = require('path');


const https = require('https');
const fs = require('fs');
const options = {
  key: fs.readFileSync('/usr/local/ssl/private.key'),
  cert: fs.readFileSync('/usr/local/ssl/certificate.crt'),
  ca: fs.readFileSync('/usr/local/ssl/ca_bundle.crt')
};



const app = express();

app.use(express.static(__dirname + '/dist'));

app.get('/*', function(req,res) {
 	res.sendFile(path.join(__dirname + '/dist/index.html'));
});

https.createServer(options, app).listen(443);

