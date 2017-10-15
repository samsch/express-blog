const config = require('../config');

const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Promise = require('bluebird');
const session = require('express-session');
const scrypt = require('scrypt-for-humans');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: config.secret,
    httpOnly: true,
    secure: true,
    resave: false,
    saveUninitialized: false,
  })
);

app.post('/login', function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.json({
      error: true,
      message:
        'Missing request parameter(s). Expected json object with username and password keys.',
    });
    return;
  }
  Promise.try(function() {
    return scrypt.verifyHash(
      req.body.password,
      config.users[req.body.username]
    );
  })
    .then(function() {
      req.session.user = req.body.username;
      res.json({
        error: false,
        message: 'Successfully logged in',
      });
    })
    .catch(function(error) {
      res.json({
        error: true,
        message: 'Invalid username+password',
      });
    });
});

app.get('/', function(req, res) {
  req.session.viewCount = req.session.viewCount ? req.session.viewCount + 1 : 1;
  res.send(`Hello World! You have been here ${req.session.viewCount} times.`);
});

// If securePort is defined in config, then we want to enable serving
// over https on that port. Otherwise, the app is probably being served
// from behind a proxy which terminates tls.
if (config.securePort) {
  const httpsServer = https.createServer(
    {
      key: fs.readFileSync(path.resolve(config.tlsKey)),
      cert: fs.readFileSync(path.resolve(config.tlsCert)),
    },
    app
  );
  httpsServer.listen(config.securePort);
  console.log(`Example app is server via https on port ${config.securePort}.`);
}

app.listen(config.port, function() {
  console.log(`Example app listening on port ${config.port}.`);
});
