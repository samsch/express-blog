'use strict';
const { Router } = require('express');
const Promise = require('bluebird');

module.exports = knex => {
  const router = Router();

  router.get('/api/user', (req, res) => {
    if (typeof req.session.userId !== 'number') {
      res.status(401).json({
        error: 'Unauthenticated',
      });
      return;
    }
    Promise.try(() => {
      const userId = req.session.userId;
      // Only get the necessary field of the user
      return knex('user').select('id', 'name', 'email').where({ id: userId });
    })
      .then(users => {
        if (users.length !== 1) {
          return Promise.fromCallback(callback =>
            req.session.destroy(callback)
          ).finally(() => {
            throw new Error('Unauthenticated');
          });
        }
        res.json({
          user: users[0],
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

  return router;
};
