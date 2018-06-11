'use strict';
const config = require('../config');

const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Promise = require('bluebird');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const scrypt = require('scrypt-for-humans');
const randomNumber = require('random-number-csprng');
const blogRouters = require('./blog');

const knex = require('knex')({
  client: 'pg',
  connection: config.pgconnection,
  version: '10',
});

const store = new KnexSessionStore({ knex });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: config.secret,
    httpOnly: true,
    secure: true,
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.post('/api/login', (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({
      error:
        'Missing request parameter(s). Expected json object with email and password keys.',
    });
    return;
  }
  Promise.try(() => {
    return randomNumber(0, 200);
  })
    .then(random => {
      return Promise.all([
        Promise.delay(random),
        knex('author').where({ email: req.body.email }),
      ]);
    })
    .then(([, authors]) => {
      if (authors.length !== 1) {
        throw new Error('invalid');
      }
      return scrypt
        .verifyHash(req.body.password, authors[0].password)
        .then(() =>
          Promise.fromCallback(callback =>
            req.session.regenerate(callback)
          ).catch(err => {
            console.log('Failed to regenerate session for login', err);
            return err;
          })
        )
        .then(() => {
          req.session.authorId = authors[0].id;
          res.json({
            message: 'Successfully logged in',
            author: authors[0],
          });
        });
    })
    .catch(() => {
      req.session.destroy(err => {
        if (err) {
          console.log('Failed to destroy session on bad login', err);
        }
        res.json({
          error: 'Invalid email or password',
        });
      });
    });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.status(500).json({
        error: 'Failed to log user out',
      });
    } else {
      res.json({
        message: 'You are now logged out',
      });
    }
  });
});

app.get('/api/user', (req, res) => {
  if (typeof req.session.authorId !== 'number') {
    res.status(401).json({
      error: 'Unauthenticated',
    });
    return;
  }
  Promise.try(() => {
    const authorId = req.session.authorId;
    return knex('author').where({ id: authorId });
  })
    .then(authors => {
      if (authors.length !== 1) {
        return Promise.fromCallback(callback =>
          req.session.destroy(callback)
        ).then(
          () => {
            throw new Error('Unauthenticated');
          },
          () => {
            throw new Error('Unauthenticated');
          }
        );
      }
      const author = authors[0];
      res.json({
        author,
      });
    })
    .catch(error => {
      if (error.message === 'Unauthenticated') {
        res.status(401).json({
          error: 'User not authenticated, please login.',
        });
      } else {
        res.status(500).json({
          error:
            'Something went wrong processing your request, please try again.',
        });
      }
    });
});

const authenticatedMiddleware = (req, res, next) => {
  Promise.try(() => {
    const authorId = req.session.authorId;
    if (!authorId) {
      throw new Error('Unauthenticated');
    }
    return knex('author').where({ id: authorId });
  })
    .then(authors => {
      if (authors.length !== 1) {
        throw new Error('Unauthenticated');
      }
      req.author = authors[0];
      next();
    })
    .catch(error => {
      if (error.message === 'Unauthenticated') {
        res.status(401).json({
          error: 'User not authenticated, please login.',
        });
      } else {
        res.status(500).json({
          error:
            'Something went wrong processing your request, please try again.',
        });
      }
    });
};

app.use('/api', blogRouters.getPublicRouter(knex));
app.use('/api', authenticatedMiddleware, blogRouters.getPrivateRouter(knex));

app.use(express.static('public'));

app.get('*', (req, res, next) => {
  if (!req.accepts('html')) {
    next();
    return;
  }
  const options = {
    root: __dirname + '/../public/',
    dotfiles: 'deny',
  };
  res.sendFile('index.html', options, err => {
    if (err) {
      console.log('Failed to send index.html', err);
      res.end();
    }
  });
});

app.use((req, res) => {
  res.sendStatus(404);
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

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}.`);
});
