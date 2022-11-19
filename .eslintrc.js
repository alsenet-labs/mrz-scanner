module.exports = {
  'env': {
      'commonjs': true,
      "es6": true,
      'node': true
  },
  'extends': ['eslint:recommended', 'plugin:flowtype/recommended', "google"],
  'globals': {
      'Atomics': 'readonly',
      'SharedArrayBuffer': 'readonly'
  },
  'parserOptions': {
    "ecmaVersion": 9,
    "sourceType": "module",
  },
  'rules': {
      'indent': [
          'error',
          2
      ],
      'linebreak-style': [
          'error',
          'unix'
      ],
      'quotes': [
          'error',
          'single'
      ],
      'semi': [
          'error',
          'always'
      ]
  }
};