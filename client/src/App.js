import React from 'react';
import PropTypes from 'prop-types';
import baseStyle from './style.scss';

const App = props => (
  <div>
    <h1 className={baseStyle.headerBorder}>Blog</h1>
    <div>
      {props.blog.posts.length > 0 ? (
        <div>
          {props.blog.posts.map(({ id, title, post }) => (
            <div key={id}>
              <h2>{title}</h2>
              <div>{post}</div>
            </div>
          ))}
        </div>
      ) : (
        <div>No posts</div>
      )}
    </div>
    <div />
    <div className={baseStyle.div}>
      <button type="button" onClick={props.action.loadPosts}>
        Load
      </button>
    </div>
  </div>
);
App.propTypes = {
  blog: PropTypes.shape({
    posts: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        post: PropTypes.string.isRequired,
      })
    ).isRequired,
  }),
  action: PropTypes.shape({
    loadPosts: PropTypes.func.isRequired,
  }),
};

export default App;
