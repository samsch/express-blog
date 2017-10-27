import createStore from '@samsch/subscribe-store';

const emailValidators = [
  email => (email.length > 0 ? true : 'Email is required'),
  email =>
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
      email
    )
      ? true
      : 'Email must be valid, like "janedoe@example.com"',
];

const passwordValidators = [
  password =>
    password.length > 0
      ? password.length < 6 ? 'Password must be at least 6 characters' : true
      : 'Password is required',
];

const getValidationArray = (validators, value) =>
  validators.reduce((valid, validator) => {
    const validation = validator(value);
    if (typeof validation === 'string') {
      return valid.concat(validation);
    }
    return valid;
  }, []);

export default appAction => {
  const loginStore = createStore({
    email: '',
    password: '',
    emailError: [],
    passwordError: [],
    logging: false,
    error: null,
  });
  loginStore.action = {
    updateEmail(email) {
      loginStore.updateState({
        email,
        emailError: getValidationArray(emailValidators, email),
      });
    },
    updatePassword(password) {
      loginStore.updateState({
        password,
        passwordError: getValidationArray(passwordValidators, password),
      });
    },
    login() {
      loginStore.updateState({
        logging: true,
        error: null,
      });
      fetch('/api/login', {
        method: 'post',
        body: JSON.stringify({
          email: loginStore.state.email,
          password: loginStore.state.password,
        }),
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json().then(data => ({ res, data })))
        .then(({ res, data }) => {
          if (data.error) {
            loginStore.updateState({
              logging: false,
              error: data.error,
            });
          } else {
            loginStore.updateState({
              logging: false,
              password: '',
            });
            appAction.setLogin(true);
            appAction.gotoNewPost();
          }
        });
    },
  };
  fetch('/api/user', {
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
    },
  })
    .then(res => res.json().then(data => ({ res, data })))
    .then(({ res, data }) => {
      if (res.status === 200 && data.author) {
        appAction.setLogin(true);
      }
    });
  return loginStore;
};
