'use strict';
const { Router } = require('express');
const scrypt = require('scrypt-for-humans');
const Promise = require('bluebird');

module.exports = knex => {
  const router = Router();

  router.post('/api/login', (req, res) => {
    if (!req.body.email || !req.body.password) {
      res.status(400).json({
        error:
          'Email and Password are required.',
      });
      return;
    }
    Promise.try(() => {
      return knex('user').where({ email: req.body.email });
    })
      .then(users => {
        if (users.length !== 1) {
          throw new Error('invalid');
        }
        return scrypt
          .verifyHash(req.body.password, users[0].password)
          .then(() =>
            Promise.fromCallback(callback =>
              req.session.regenerate(callback)
            ).catch(err => {
              console.log('Failed to regenerate session for login', err);
              return err;
            })
          )
          .then(() => {
            res.set('csrf-token', req.csrfToken());
            req.session.userId = users[0].id;
            res.json({
              message: 'Successfully logged in',
              user: {
                id: users[0].id,
                name: users[0].name,
                email: users[0].email,
              },
            });
          });
      })
      .catch(() => {
        req.session.regenerate(err => {
          if (err) {
            console.log('Failed to destroy session on bad login', err);
          }
          res.set('csrf-token', req.csrfToken());
          res.json({
            error: 'Email and Password combination is incorrect. Check what you entered and try again.',
          });
        });
      });
  });

  return router;
};
