module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:promise/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  plugins: ['node', 'import', 'promise'],
  rules: {},
};
