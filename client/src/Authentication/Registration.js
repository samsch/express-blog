import React from 'react';
// import PropTypes from 'prop-types';
import classNames from 'classnames';
import If from '../component/If';
import Button from '../component/Button';
import { post } from '../shared/http';

class Registration extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      submitting: false,
      error: '',
      triedToSubmit: false,
    };
    this.onSubmit = e => {
      e.preventDefault();
      if (e.target.checkValidity() === true) {
        this.setState({ submitting: true });
        post('/api/register', {
          name: this.state.name,
          email: this.state.email,
          password: this.state.password,
        })
          .then(({ res, data }) => {
            if (data.error) {
              this.setState({
                submitting: false,
                error: data.error,
              });
            } else if (res.ok && data.user) {
              this.setState({
                submitting: false,
              });
              // eslint-disable-next-line no-self-assign
              window.location.href = window.location.href;
            } else {
              this.setState({
                submitting: false,
                error: 'Something went wrong! Please refresh and try again.',
              });
            }
          })
          .catch(() => {
            this.setState({
              submitting: false,
              error: 'Not able to connect, check your network and try again.',
            });
          });
      } else {
        this.setState({ triedToSubmit: true });
      }
    };
  }
  render () {
    return (
      <form
        onSubmit={this.onSubmit}
        className={classNames({'needs-validation': true, 'was-validated': this.state.triedToSubmit})}
        noValidate
      >
        <h2>Registration</h2>
        <div className="form-group row">
          <label htmlFor="login-name">Name</label>
          <input
            value={this.state.name}
            onChange={e => this.setState({ name: e.target.value })}
            type="text"
            required
            className="form-control"
            id="login-name"
          />
          <div className="invalid-feedback">
            Name is required
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="login-email">Email</label>
          <input
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
            type="text"
            required
            className="form-control"
            id="login-email"
          />
          <div className="invalid-feedback">
            Email is required
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="login-password">Password</label>
          <input
            value={this.state.password}
            onChange={e => this.setState({ password: e.target.value })}
            type="password"
            required
            className="form-control"
            id="login-password"
          />
          <div className="invalid-feedback">
            Password is required
          </div>
        </div>
        <div className="row justify-content-end">
          <div className="col-md-auto">
            <Button
              type="submit"
              className="btn-primary"
              disabled={this.state.submitting}
            >
              Register
            </Button>
          </div>
        </div>
        <If true={this.state.error}>
          <div className="row">
            <p className="col alert alert-danger">{this.state.error}</p>
          </div>
        </If>
      </form>
    );
  }
}
// Registration.propTypes = {};
export default Registration;
