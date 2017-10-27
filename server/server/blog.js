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
              'Something went wrong retrieving this post, please try again',
          });
        } else {
          res.json({
            post: posts[0],
          });
        }
      });
  });

  router.get('/authors', (req, res) => {
    knex('author')
      .columns(['id', 'name'])
      .then(authors => {
        res.json({
          authors,
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
      newPost.author = req.author.id;
      knex('post')
        .insert(
          blogPostFields.reduce(
            (post, { field }) =>
              Object.assign(post, { [field]: newPost[field] }),
            {
              author: req.author.id,
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
            error: 'Something went wrong, please try again',
          });
        });
    }
  });

  return router;
};
