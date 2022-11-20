# regression-exponential

  [![NPM version][npm-image]][npm-url]
  [![build status][travis-image]][travis-url]
  [![npm download][download-image]][download-url]

Exponential Regression.

## Installation

`$ npm install --save ml-regression-exponential`

## Usage

This calculates parameters A and B for the equation `y = A * e^(B * x)`.

```js
import ExponentialRegression from 'ml-regression-exponential';

const x = [0, 1, 2, 3, 4];
const y = [1.5, 2.5, 3.5, 5.0, 7.5];

const regression = new ExponentialRegression(x, y);

regression.A // 0.391202
regression.B // 1.579909
regression.predict(2); // 3.454825
regression.toString(3); // f(x) = 1.58 * exp(0.391 * x)
```

## License

  [MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/ml-regression-exponential.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ml-regression-exponential
[travis-image]: https://img.shields.io/travis/mljs/regression-exponential/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/mljs/regression-exponential
[download-image]: https://img.shields.io/npm/dm/ml-regression-exponential.svg?style=flat-square
[download-url]: https://npmjs.org/package/ml-regression-exponential
