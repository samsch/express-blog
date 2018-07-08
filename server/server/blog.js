'use strict';
const express = require('express');

const pageSize = 10;

module.exports.getPublicRouter = knex => {
  const router = express.Router();

  router.get(['/posts', '/posts/:number'], (req, res) => {
    const page = req.params.number > 0 ? req.params.number - 1 : 0;
    knex('post')
      .orderBy('created_at', 'desc')
      .limit(10)
      .offset(page * pageSize)
      .then(posts => {
        res.json({
          posts,
        });
      });
  });

  router.get('/post/:id', (req, res) => {
    knex('post')
      .where({ id: req.params.id })
      .then(posts => {
        if (posts.length === 0) {
          res.status(404).json({
            error: 'Post ID not found',
          });
        } else if (posts.length !== 1) {
          res.status(500).json({
            error:
              'Something went wrong retrieving this post, please refresh the page and try again',
          });
        } else {
          res.json({
            post: posts[0],
          });
        }
      });
  });

  router.get('/users', (req, res) => {
    knex('user')
      .columns(['id', 'name'])
      .then(users => {
        res.json({
          users,
        });
      });
  });

  return router;
};

const blogPostFields = [
  {
    field: 'title',
    valid: value => typeof value === 'string' && value.length > 0,
  },
  {
    field: 'post',
    valid: value => typeof value === 'string' && value.length > 0,
  },
];

module.exports.getPrivateRouter = knex => {
  const router = express.Router();

  router.post('/post', (req, res) => {
    const newPost = req.body.post;
    if (!blogPostFields.every(({ field, valid }) => valid(newPost[field]))) {
      res.status(400).json({
        error: 'New post must contain a title and body.',
      });
    } else {
      knex('post')
        .insert(
          blogPostFields.reduce(
            (post, { field }) =>
              Object.assign(post, { [field]: newPost[field] }),
            {
              user_id: req.user.id,
            }
          )
        )
        .returning('id')
        .then(ids => {
          res.json({
            message: 'Added post',
            id: ids[0],
          });
        })
        .catch(error => {
          console.log('Error adding post', error);
          res.status(500).json({
            error: 'Something went wrong! Save a copy of your post somewhere else, refresh and try again.',
          });
        });
    }
  });

  router.delete('/post/:id', (req, res) => {
    const id = req.params.id;
    return knex('post')
      .where({ id })
      .then(posts => {
        if (posts.length === 1) {
          return knex('post').delete({ id });
        }
        throw new Error('Not Found');
      })
      .then(rowsAffected => {
        if (rowsAffected === 1) {
          res.json({
            message: 'Post deleted',
          });
        } else {
          res.status(500).json({
            error:
              'Something went wrong deleting the post. Please refresh the page and try again.',
          });
        }
      })
      .catch(error => {
        if (error.message === 'Not Found') {
          res.status(404).json({
            error: 'Post doesn\'t exist',
          });
        }
      });
  });

  return router;
};
