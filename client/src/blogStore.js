import createStore from '@samsch/subscribe-store';

const postArrayToObject = (postArray, obj) =>
  postArray.reduce(
    (res, post) => {
      res.obj[post.id] = post;
      res.list.push(post.id);
      return res;
    },
    { obj: Object.assign({}, obj), list: [] }
  );

const createErrorPost = (id, error) => ({ id, error });

export default () => {
  const blogStore = createStore({
    posts: {},
    loadingPosts: true,
    list: [],
    error: null,
  });
  blogStore.action = {
    loadPosts: (page = 1) => {
      blogStore.updateState({ loadingPosts: true, list: null, error: null });
      fetch('/api/posts/' + page)
        .then(res => res.json().then(data => ({ res, data })))
        .then(({ res, data }) => {
          if (res.status !== 200) {
            throw new Error();
          }
          const { obj: posts, list } = postArrayToObject(
            data.posts,
            blogStore.state.posts
          );
          blogStore.updateState({
            posts,
            list,
            loadingPosts: false,
          });
        })
        .catch(() => {
          blogStore.updateState({
            loadingPosts: false,
            error: 'Failed to load posts',
          });
        });
    },
    loadPost: id => {
      blogStore.updateState({ loadingPosts: true });
      fetch('/api/post/' + id)
        .then(res => res.json().then(data => ({ res, data })))
        .then(({ res, data }) => {
          if (res.status === 404) {
            blogStore.updateState({
              posts: Object.assign({}, blogStore.state.posts, { [id]: false }),
              loadingPosts: false,
            });
          } else if (res.status === 200) {
            blogStore.updateState({
              posts: Object.assign({}, blogStore.state.posts, {
                [id]: data.post,
              }),
              loadingPosts: false,
            });
          } else {
            throw new Error();
          }
        })
        .catch(() => {
          blogStore.updateState({
            loadingPosts: false,
            posts: Object.assign({}, blogStore.state.posts, {
              [id]: createErrorPost(id, 'Failed to load post'),
            }),
          });
        });
    },
  };
  return blogStore;
};
