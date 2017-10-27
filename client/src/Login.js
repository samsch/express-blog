import React from 'react';
import PropTypes from 'prop-types';
import TextInput from './component/TextInput';

const Login = props => (
  <div>
    <form
      onSubmit={e => {
        e.preventDefault();
        props.loginAction.login();
      }}
    >
      <TextInput
        label="Email"
        name="email"
        value={props.login.email}
        onChange={props.loginAction.updateEmail}
        errors={props.login.emailError}
      />
      <TextInput
        label="Password"
        name="blog-password"
        value={props.login.password}
        onChange={props.loginAction.updatePassword}
        errors={props.login.passwordError}
      />
      <div>
        <button
          type="submit"
          disabled={
            props.login.logging ||
            props.login.emailError.length > 0 ||
            props.login.passwordError.length > 0
          }
        >
          {props.login.logging ? 'Checking...' : 'Login'}
        </button>
      </div>
      {props.login.error && (
        <div>
          <p>{props.login.error}</p>
        </div>
      )}
    </form>
  </div>
);
Login.propTypes = {
  login: PropTypes.shape({
    email: PropTypes.string.isRequired,
    emailError: PropTypes.arrayOf(PropTypes.string).isRequired,
    password: PropTypes.string.isRequired,
    passwordError: PropTypes.arrayOf(PropTypes.string).isRequired,
    logging: PropTypes.bool.isRequired,
    error: PropTypes.string,
  }).isRequired,
  loginAction: PropTypes.shape({
    login: PropTypes.func.isRequired,
    updateEmail: PropTypes.func.isRequired,
    updatePassword: PropTypes.func.isRequired,
  }).isRequired,
};
export default Login;
