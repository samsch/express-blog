import React from 'react';
import PropTypes from 'prop-types';

const Post = props =>
  props.post.error ? (
    <div>
      <div>{props.post.error}</div>
    </div>
  ) : (
    <div>
      <h2>{props.post.title}</h2>
      <div>{props.post.post}</div>
    </div>
  );
Post.propTypes = {
  post: PropTypes.oneOfType([
    PropTypes.shape({
      error: PropTypes.string.isRequired,
    }),
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      post: PropTypes.string.isRequired,
    }),
  ]),
};
export default Post;
