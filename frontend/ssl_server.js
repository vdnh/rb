const express = require('express');
const path = require('path');


const https = require('https');
const fs = require('fs');
const options = {
  key: fs.readFileSync('/local_ssl/private-key.key'),
  cert: fs.readFileSync('/local_ssl/csr.txt')
};



const app = express();

app.use(express.static(__dirname + '/dist'));

app.get('/*', function(req,res) {
 	res.sendFile(path.join(__dirname + '/dist/index.html'));
});

https.createServer(options, app).listen(443);

