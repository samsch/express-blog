import React from 'react';
// import PropTypes from 'prop-types';
import LoginForm from './LoginForm';
import { get, post } from '../shared/http';
import Registration from './Registration';
import DropdownOpener from './DropdownOpener';
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
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h1>Welcome, please login</h1>
            <LoginForm onSubmit={this.onSubmit} loading={this.state.loggingIn} error={this.state.error} />
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <DropdownOpener>
              <Registration />
            </DropdownOpener>
          </div>
        </div>
      </div>
    );
  }
}
export default Authentication;
