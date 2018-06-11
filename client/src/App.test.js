/* eslint-env jest */
import React from 'react';
import renderer from 'react-test-renderer';
import App from './App';

describe('The App component', () => {
  const baseProps = {
    app: {
      page: 'blog',
      pageState: 1,
      loggedIn: false,
    },
    blog: {
      posts: {},
      loadingPosts: true,
      list: [],
      error: null,
    },
    action:{
      appAction: {
        gotoBlog: jest.fn(),
        gotoNewPost: jest.fn(),
        gotoLogin: jest.fn(),
      },
      blogAction: {
        loadPosts: jest.fn(),
        loadPost: jest.fn(),
      },
      loginAction: {
        logout: jest.fn(),
      },
    },
  };

  test('Should render initial view while waiting for data', () => {
    const props = baseProps;
    const renderedApp = renderer.create(<App {...props} />);
    expect(renderedApp.toJSON()).toMatchSnapshot();
  });
  test('Should render blog posts', () => {
    const props = {
      ...baseProps,
      blog: {
        posts: {
          '1': {
            id: 1,
            title: 'Post about nonsense',
            author: 1,
            created_at: '2017-10-19T17:59:42.795Z',
            updated_at: '2017-10-19T17:59:42.795Z',
            post: 'This is a short demo post about nothing.',
          },
          '2': {
            id: 2,
            title: 'React Basic Input',
            author: 1,
            created_at: '2017-10-24T19:16:55.722Z',
            updated_at: '2017-10-24T19:16:55.722Z',
            post: 'This is the second post now! I wrote a thing about a thing!',
          },
        },
        loadingPosts: false,
        list: [2,1],
        error: null,
      },
    };
    const renderedApp = renderer.create(<App {...props} />);
    expect(renderedApp.toJSON()).toMatchSnapshot();
  });
});
