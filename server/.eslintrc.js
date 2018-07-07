'use strict';
module.exports = {
  env: {
    node: true,
    es6: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: '2018',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: false,
    },
  },
  rules: {
    'array-callback-return': 'warn',
    'eqeqeq': ["error", "always", {"null": "ignore"}],
    'no-empty-function': 'warn',
    'no-eval': 'warn',
    'no-implied-eval': 'warn',
    'no-invalid-this': 'error',
    'no-param-reassign': 'error',
    'no-return-assign': 'error',
    'no-return-await': 'error',
    'no-self-compare': 'warn',
    'no-useless-concat': 'warn',
    'no-useless-return': 'warn',
    'no-void': 'error',
    'no-warning-comments': 'warn',
    'no-with': 'error',
    'prefer-promise-reject-errors': 'error',
    'no-shadow-restricted-names': 'error',
    'no-use-before-define': 'error',
    'no-duplicate-imports': 'error',
    'no-useless-rename': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'no-console': 'off',
    
    // style rules
    'semi': ['error', 'always'],
    'wrap-iife': ['warn', 'inside'],
    'space-before-function-paren': 'warn',
    'no-trailing-spaces': 'error',
    'quotes': ["warn", "single"],
    'arrow-spacing': 'warn',
  },
};
