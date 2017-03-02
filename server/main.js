// @flow
const config = require('../config');

const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

// If securePort is defined in config, then we want to enable serving
// over https on that port. Otherwise, the app is probably being served
// from behind a proxy which terminates tls.
if(config.securePort) {
  const httpsServer = https.createServer({
    key: fs.readFileSync(path.resolve(config.tlsKey)),
    cert: fs.readFileSync(path.resolve(config.tlsCert)),
  }, app);
  httpsServer.listen(config.securePort);
  console.log(`Example app is server via https on port ${config.securePort}.`);
}

app.listen(config.port, function () {
  console.log(`Example app listening on port ${config.port}.`);
});
