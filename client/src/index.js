import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import './bootstrap/styles.scss';
import styles from './index.scss';
import Authentication from './Authentication';
import NavBar from './NavBar';
import Dashboard from './Dashboard';
import Posts from './Posts';
import NewPost from './NewPost';

const rootElement = document.getElementById('root');

const app = () => (
  <div className="container">
    <NavBar />
    <div className={styles.separator}></div>
    <Route
      path="/"
      exact
      render={() => <Dashboard />}
    />
    <Route
      path="/New-Post"
      render={() => <NewPost />}
    />
    <Route
      path="/Posts"
      render={() => <Posts />}
    />
  </div>
);

ReactDOM.render(
  <BrowserRouter>
    <Authentication app={app} />
  </BrowserRouter>,
  rootElement
);
