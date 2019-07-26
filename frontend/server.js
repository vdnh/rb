// const express = require('express');
// const path = require('path');

// const app = express();

// app.use(express.static(__dirname + '/dist'));

// app.get('/*', function(req,res) {
//  	res.sendFile(path.join(__dirname + '/dist/index.html'));
// });
// app.listen(80);


// Make sure to run the code using sudo as port 80 needs sudo access 

const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(301,{Location: `https://${req.headers.host}${req.url}`});
  res.end();
});

server.listen(80);
console.log(`http2https ==> 80:443`);