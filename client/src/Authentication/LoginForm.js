import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import If from '../component/If';
import Button from '../component/Button';

class LoginForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      triedToSubmit: false,
    };
    this.onSubmit = e => {
      e.preventDefault();
      if (e.target.checkValidity() === true) {
        this.props.onSubmit(this.state.email, this.state.password);
      } else {
        this.setState({ triedToSubmit: true });
      }
    };
  }
  render () {
    const { loading, error } = this.props;
    return (
      <form
        onSubmit={this.onSubmit}
        className={classNames({'needs-validation': true, 'was-validated': this.state.triedToSubmit})}
        noValidate
      >
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
              disabled={loading}
            >
              Log In
            </Button>
          </div>
        </div>
        <If true={error}>
          <div className="row">
            <p className="col alert alert-danger">{error}</p>
          </div>
        </If>
      </form>
    );
  }
}
LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};
export default LoginForm;
