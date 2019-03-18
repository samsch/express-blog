'use strict';
const { Router } = require('express');
const scrypt = require('scrypt-for-humans');
const Promise = require('bluebird');
const randomNumber = require('random-number-csprng');
const errors = require('errors');

errors.create({
  name: 'EmailInUse',
});

errors.create({
  name: 'FailedToCreateUser',
});

module.exports = knex => {
  const router = Router();

  router.post('/api/register', (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
      res.status(400).json({
        error:
          'Name, Email and Password are required.',
      });
      return;
    }
    Promise.try(() => {
      Promise.fromCallback(callback =>
        req.session.regenerate(callback)
      ).catch(err => {
        console.log('Failed to regenerate session for login', err);
        throw err;
      });
    })
      .then(() => randomNumber(0, 1000))
      .then(random => Promise.all([
        Promise.delay(random),
        knex('user').where({ email: req.body.email }),
      ]))
      .then(([, users]) => {
        if (users.length !== 0) {
          throw new errors.EmailInUse();
        }
        return scrypt.hash(req.body.password);
      })
      .then(hash => knex('user')
        .insert({
          name: req.body.name,
          email: req.body.email,
          password: hash,
        })
        .returning('id'))
      .catch(error => {
        if (error instanceof errors.EmailInUse) {
          throw error;
        }
        throw new errors.FailedToCreateUser();
      })
      .then(([id]) => knex('user').where({ id }))
      .then(users => {
        req.session.userId = users[0].id;
        res.json({
          message: 'Successfully logged in',
          user: {
            id: users[0].id,
            name: users[0].name,
            email: users[0].email,
          },
        });
      })
      .catch(errors.EmailInUse, () => {
        res.json({
          error: 'This email address is already in use.',
        });
        return 'destroySession';
      })
      .catch(errors.FailedToCreateUser, () => {
        res.json({
          error: 'Failed to create user. Please try again.',
        });
        return 'destroySession';
      })
      .catch(() => {
        res.json({
          error: 'Something went wrong. Please refresh the page. You should be able to log in with the credentials you entered.',
        });
        return 'destroySession';
      })
      .then(final => {
        if (final === 'destroySession') {
          req.session.regenerate(err => {
            if (err) {
              console.log('Failed to destroy session on bad registration', err);
            }
            res.set('csrf-token', req.csrfToken());
          });
        }
      });
  });

  return router;
};
