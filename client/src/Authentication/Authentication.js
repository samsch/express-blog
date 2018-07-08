import React from 'react';
// import PropTypes from 'prop-types';
import LoginForm from './LoginForm';
import { get, post } from '../shared/http';
import Registration from './Registration';
import Toggle from './Toggle';
import Button from '../component/Button';
import Loading from '../component/Loading';

class Authentication extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      authenticated: false,
      error: '',
      loading: true,
      loggingIn: false,
    };
    this.onSubmit = (email, password) => {
      this.setState({ error: '', loggingIn: true });
      post('/api/login', { email, password })
        .then(({ res, data }) => {
          if (res.ok) {
            if (data.error) {
              this.setState({
                error: data.error,
                loggingIn: false,
              });
            } else {
              this.setState({
                authenticated: data.user,
                loggingIn: false,
              });
            }
          } else {
            this.setState({
              error: (data && data.error) || 'Something went wrong! Please refresh and try again.',
              loggingIn: false,
            });
          }
        })
        .catch(() => {
          this.setState({
            error: 'Not able to connect, check your network and try again.',
            loggingIn: false,
          });
        });
    };
  }
  componentDidMount () {
    get('/api/user')
      .then(({ res, data }) => {
        if (res.ok) {
          this.setState({
            authenticated: data.user,
            loading: false,
          });
        } else if (res.status === 401) {
          this.setState({
            authenticated: false,
            loading: false,
          });
        }
      })
      .catch(() => {
        this.setState({
          error: 'Not able to connect, check your network and try again.',
        });
      });
  }
  render () {
    if (this.state.loading) {
      if (this.state.error) {
        return (
          <div className="container">
            <div className="alert alert-danger">{this.state.error}</div>
          </div>
        );
      }
      return <Loading size={3} />;
    }
    if (this.state.authenticated) {
      return this.props.app(this.state.authenticated);
    }
    return (
      <div className="container">
        <nav className="navbar navbar-dark bg-dark navbar-expand">
          <a href="/" className="navbar-brand">Express Blog</a>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="/">Home</a>
              </li>
              <li className="nav-item active">
                <a className="nav-link" href="/admin">Admin Login</a>
              </li>
            </ul>
          </div>
        </nav>
        <Toggle>
          {(isRegistrationView, { toggle }) => (
            <div className="row justify-content-center">
              {isRegistrationView ? (
                <div className="col-md-8">
                  <div className="row justify-content-between align-items-center">
                    <h1 className="col-auto mb-4 mt-4">Register</h1>
                    <Button className="col-auto btn-link" onClick={toggle}>Back to Login</Button>
                  </div>
                  <Registration />
                </div>
              ) : (
                <div className="col-md-8">
                  <div className="row justify-content-between align-items-center">
                    <h1 className="col-auto mb-4 mt-4">Welcome, please login</h1>
                    <Button className="col-auto btn-link" onClick={toggle}>Register</Button>
                  </div>
                  <LoginForm onSubmit={this.onSubmit} loading={this.state.loggingIn} error={this.state.error} />
                </div>
              )}
            </div>
          )}
        </Toggle>
      </div>
    );
  }
}
export default Authentication;
