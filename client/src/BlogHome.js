import React from 'react';
import PropTypes from 'prop-types';
import Post from './Post';
import OnMount from './component/OnMount';

const BlogHome = props => (
  <div>
    <OnMount onMount={props.action.loadPosts} />
    {(() => {
      if (props.blog.loadingPosts) {
        return <div>Loading posts...</div>;
      }
      if (props.blog.error) {
        return <div>{props.blog.error}</div>;
      }
      if (props.blog.list) {
        return (
          <div>
            {props.blog.list.map(id => {
              const post = props.blog.posts[id];
              if (!post) {
                return null;
              }
              return <Post key={id} post={post} />;
            })}
          </div>
        );
      }
    })()}
  </div>
);
BlogHome.propTypes = {
  blog: PropTypes.shape({
    posts: PropTypes.objectOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        post: PropTypes.string.isRequired,
      })
    ).isRequired,
    list: PropTypes.arrayOf(PropTypes.number),
    loadingPosts: PropTypes.bool.isRequired,
    error: PropTypes.string,
  }),
  action: PropTypes.shape({
    loadPosts: PropTypes.func.isRequired,
  }),
};
export default BlogHome;
