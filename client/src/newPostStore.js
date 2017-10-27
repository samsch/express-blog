import createStore from '@samsch/subscribe-store';

const titleValidators = [
  title => (title.length > 0 ? true : 'Title is required'),
];

const postValidators = [post => (post.length > 0 ? true : 'Post is required')];

const getValidationArray = (validators, value) =>
  validators.reduce((valid, validator) => {
    const validation = validator(value);
    if (typeof validation === 'string') {
      return valid.concat(validation);
    }
    return valid;
  }, []);

export default appAction => {
  const newPostStore = createStore({
    title: '',
    post: '',
    titleError: [],
    postError: [],
    saving: false,
    error: null,
  });
  newPostStore.action = {
    updateTitle(title) {
      newPostStore.updateState({
        title,
        titleError: getValidationArray(titleValidators, title),
      });
    },
    updatePost(post) {
      newPostStore.updateState({
        post,
        postError: getValidationArray(postValidators, post),
      });
    },
    submit() {
      newPostStore.updateState({
        saving: true,
        error: null,
      });
      fetch('/api/post', {
        method: 'post',
        body: JSON.stringify({
          post: {
            title: newPostStore.state.title,
            post: newPostStore.state.post,
          },
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
            newPostStore.updateState({
              saving: false,
              error: data.error,
            });
          } else {
            newPostStore.updateState({
              saving: false,
              title: '',
              post: '',
            });
            appAction.gotoBlog();
          }
        });
    },
  };
  return newPostStore;
};
