import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import createAppStore from './appStore';
import createBlogStore from './blogStore';
import createLoginStore from './loginStore';
import createNewPostStore from './newPostStore';

const appStore = createAppStore();
const blogStore = createBlogStore();
const loginStore = createLoginStore(appStore.action);
const newPostStore = createNewPostStore(appStore.action);

const appRootElement = document.getElementById('app-root');

const render = () => {
  ReactDOM.render(
    <App
      blog={blogStore.state}
      action={{
        blogAction: blogStore.action,
        appAction: appStore.action,
        loginAction: loginStore.action,
        newPostAction: newPostStore.action,
      }}
      app={appStore.state}
      login={loginStore.state}
      newPost={newPostStore.state}
    />,
    appRootElement
  );
};

appStore.subscribe(render);
loginStore.subscribe(render);
blogStore.subscribe(render);
newPostStore.subscribe(render);

render();
