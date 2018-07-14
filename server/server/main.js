'use strict';
const config = require('../../config');

const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Promise = require('bluebird');
const session = require('express-session');
const csrf = require('csurf');
const KnexSessionStore = require('connect-session-knex')(session);
const loginRouter = require('./login');
const registrationRouter = require('./register');
const userRouter = require('./user');
const blogRouters = require('./blog');

const knex = require('knex')({
  client: 'pg',
  connection: config.pgconnection,
  version: '10',
});

const store = new KnexSessionStore({ knex });

app.set('view engine', 'pug');

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

app.get(['/','/page/:number'], (req, res) => {
  const pageSize = 10;
  const page = req.params.number > 0 ? req.params.number - 1 : 0;
  knex('post')
    .orderBy('created_at', 'desc')
    .limit(10)
    .offset(page * pageSize)
    .then(posts => {
      res.render('blog', {
        navLinks: [{
          active: true,
          path: '/',
          label: 'Home',
        }, {
          active: false,
          path: '/admin',
          label: 'Admin Login',
        }],
        posts,
      });
    });
});

app.get('/post/:id', (req, res, next) => {
  knex('post')
    .where({ id: req.params.id })
    .then(posts => {
      if (posts.length === 0) {
        next();
      } else if (posts.length !== 1) {
        next(new Error('More than one post returned for an ID.'));
      } else {
        res.render('post', {
          navLinks: [{
            active: false,
            path: '/',
            label: 'Home',
          }, {
            active: false,
            path: '/admin',
            label: 'Admin Login',
          }],
          post: posts[0],
        });
      }
    });
});

app.use('/admin', express.static('public'));

app.get('/admin*', (req, res, next) => {
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
app.use(csrf({
  value: req => req.get('csrf-token'),
}));
app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') {
    return next(err);
  }
  res.set('csrf-token', req.csrfToken());
  res.status(403);
  res.send({ error: 'Looks like your sessions may have expired. Please refresh and try again.' });
});
app.use(function (req, res, next) {
  res.set('csrf-token', req.csrfToken());
  next();
});

app.use(loginRouter(knex));
app.use(registrationRouter(knex));

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

app.use(userRouter(knex));

const authenticatedMiddleware = (req, res, next) => {
  Promise.try(() => {
    const userId = req.session.userId;
    if (!userId) {
      throw new Error('Unauthenticated');
    }
    return knex('user').where({ id: userId });
  })
    .then(users => {
      if (users.length !== 1) {
        throw new Error('Unauthenticated');
      }
      req.user = users[0];
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

app.use((req, res) => {
  res.sendStatus(404);
});

app.use((err, req, res, next) => {
  res.status(500);
  if (req.accepts('html')) {
    res.send('Something went wrong. Please refresh and try again.');
    return;
  }
  res.json({
    error:
      'Something went wrong processing your request, please try again.',
  });
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
