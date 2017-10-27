import React from 'react';
import PropTypes from 'prop-types';
import baseStyle from './style.scss';
import Blog from './BlogHome';
import Login from './Login';
import NewPost from './NewPost';

const link = (text, onClick) => (
  <a
    href="#"
    onClick={e => {
      e.preventDefault();
      onClick();
    }}
  >
    {text}
  </a>
);

const App = props => (
  <div>
    <h1 className={baseStyle.headerBorder}>Blog</h1>
    <div>
      <ul>
        <li>
          {props.app.page === 'blog'
            ? 'Home'
            : link('Home', props.action.appAction.gotoBlog)}
        </li>
        {props.app.loggedIn ? (
          <li>
            {props.app.page === 'newPost'
              ? 'New Post'
              : link('New Post', props.action.appAction.gotoNewPost)}
          </li>
        ) : (
          <li>
            {props.app.page === 'login'
              ? 'Login'
              : link('Login', props.action.appAction.gotoLogin)}
          </li>
        )}
      </ul>
    </div>
    <div>
      {(() => {
        switch (props.app.page) {
          case 'blog':
            return <Blog blog={props.blog} action={props.action.blogAction} />;
          case 'login':
            return (
              <Login
                login={props.login}
                loginAction={props.action.loginAction}
              />
            );
          case 'newPost':
            return (
              <NewPost
                newPost={props.newPost}
                newPostAction={props.action.newPostAction}
              />
            );
        }
      })()}
    </div>
  </div>
);
App.propTypes = {
  app: PropTypes.shape({
    page: PropTypes.string.isRequired,
    pageState: PropTypes.any,
    loggedIn: PropTypes.bool.isRequired,
  }).isRequired,
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
    appAction: PropTypes.shape({
      gotoBlog: PropTypes.func.isRequired,
      gotoNewPost: PropTypes.func.isRequired,
      gotoLogin: PropTypes.func.isRequired,
    }).isRequired,
    blogAction: PropTypes.object.isRequired,
  }),
};

export default App;
