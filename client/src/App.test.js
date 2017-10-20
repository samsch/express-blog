/* eslint-env jest */
import React from 'react';
import renderer from 'react-test-renderer';
import App from './App';

describe('The App component', () => {
  test('Should match a snapshot render', () => {
    const props = {
      state: {
        count: 17,
      },
      action: {
        increment: jest.fn(),
        decrement: jest.fn(),
        reset: jest.fn(),
      },
    };

    const renderedApp = renderer.create(<App {...props} />);
    expect(renderedApp.toJSON()).toMatchSnapshot();
  });
});
