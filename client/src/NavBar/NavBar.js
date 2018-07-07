import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route } from 'react-router-dom';
import classNames from 'classnames';
import Button from '../component/Button';
import { post } from '../shared/http';

function logOut () {
  post('/api/logout')
    .finally(() => {
      // eslint-disable-next-line no-self-assign
      window.location.href = window.location.href;
    });
}

const LsNavLink = ({ exact, to, children }) => (
  <Route path={to} exact={exact}>
    {({ match }) => (
      <li className={classNames({ 'nav-item': true, 'active': match })}>
        <Link className="nav-link" to={to}>
          {children} <span className="sr-only">(current)</span>
        </Link>
      </li>
    )}
  </Route>
);
LsNavLink.propTypes = {
  exact: PropTypes.bool,
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const NavBar = () => (
  <nav className="navbar navbar-dark bg-primary navbar-expand-md">
    <Link className="navbar-brand" to="/">Express Blog</Link>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav">
        <LsNavLink to="/" exact>Home</LsNavLink>
        <LsNavLink to="/Posts">Posts</LsNavLink>
        <LsNavLink to="/New-Post">New Post</LsNavLink>
      </ul>
    </div>
    <Button className="btn-primary" onClick={logOut}>Log out</Button>
  </nav>
);
// NavBar.propTypes = {};
export default NavBar;
