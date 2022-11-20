# regression-multivariate-linear

  [![NPM version][npm-image]][npm-url]
  [![build status][travis-image]][travis-url]
  [![npm download][download-image]][download-url]

Multivariate linear regression.

## Installation

`$ npm install --save ml-regression-multivariate-linear`

## API

### new MLR(x, y[, options])

__Arguments__

* `x`: Matrix containing the inputs
* `y`: Matrix containing the outputs

__Options__

* `intercept`: boolean indicating if intercept terms should be computed (default: true)
* `statistics`: boolean for calculating and returning regression statistics (default: true)

## Usage

```js
import MLR from 'ml-regression-multivariate-linear';

const x = [[0, 0], [1, 2], [2, 3], [3, 4]];
// Y0 = X0 * 2, Y1 = X1 * 2, Y2 = X0 + X1
const y = [[0, 0, 0], [2, 4, 3], [4, 6, 5], [6, 8, 7]];
const mlr = new MLR(x, y);
console.log(mlr.predict([3, 3]));
// [6, 6, 6]
```

## License

  [MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/ml-regression-multivariate-linear.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ml-regression-multivariate-linear
[travis-image]: https://img.shields.io/travis/mljs/regression-multivariate-linear/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/mljs/regression-multivariate-linear
[download-image]: https://img.shields.io/npm/dm/ml-regression-multivariate-linear.svg?style=flat-square
[download-url]: https://npmjs.org/package/ml-regression-multivariate-linear
