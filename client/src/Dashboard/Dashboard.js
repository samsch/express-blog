import React from 'react';
// import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Dashboard extends React.Component {
  constructor (props) {
    super(props);
  }
  render () {
    return (
      <div className="jumbotron">
        <h1 className="display-4">Ready to Write a Post?</h1>
        <Link to="/New-Post" className="btn btn-primary">Yes!</Link>
        {' '}
        <Link to="/Posts" className="btn btn-primary">Go to Posts</Link>
      </div>
    );
  }
}
// Dashboard.propTypes = {};
export default Dashboard;
