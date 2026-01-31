module.exports = {
  root: true,
  extends: '@react-native',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    node: true,
    jest: true,
  },
  globals: {
    __DEV__: 'readonly',
  },
  settings: {
    react: {
      version: '18.2',
    },
  },
  rules: {
    'prettier/prettier': 'error',
    'react-native/no-inline-styles': 'off',
  },
};
