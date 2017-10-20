import React from 'react';
import ReactDOM from 'react-dom';
import createStore from '@samsch/subscribe-store';
import App from './App';

// ### Business logic

// Basic state store, similar to React Component state api. Replace with actual
// business logic

const blogStore = createStore({
  posts: [],
  loadingPosts: true,
});
const loadPosts = () => {
  blogStore.updateState({ loadingPosts: true });
  fetch('/api/posts')
    .then(res => res.json().then(data => ({ res, data })))
    .then(({ res, data }) => {
      blogStore.updateState({
        posts: data.posts,
        loadingPosts: false,
      });
    })
    .catch(() => {
      blogStore.updateState({
        loadingPosts: false,
        error: 'Failed to load posts',
      });
    });
};

// ### App bootstrap (combine business logic with view.)

const appRootElement = document.getElementById('app-root');

const render = () => {
  ReactDOM.render(
    <App blog={blogStore.state} action={{ loadPosts }} />,
    appRootElement
  );
};

blogStore.subscribe(render);

render();
