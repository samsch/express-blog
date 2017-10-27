import createStore from '@samsch/subscribe-store';

const createAppStore = () => {
  const appStore = createStore({
    page: 'blog',
    pageState: 1,
    loggedIn: false,
  });
  appStore.action = {
    gotoBlog(page = 1) {
      appStore.updateState({
        page: 'blog',
        pageState: page,
      });
    },
    gotoPost(id) {
      appStore.updateState({
        page: 'post',
        pageState: { id },
      });
    },
    gotoLogin() {
      appStore.updateState({
        page: 'login',
        pageState: null,
      });
    },
    gotoNewPost() {
      appStore.updateState({
        page: 'newPost',
        pageState: null,
      });
    },
    setLogin(loggedIn) {
      appStore.updateState({
        loggedIn,
      });
    },
  };
  return appStore;
};

export default createAppStore;
