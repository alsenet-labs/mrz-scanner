# regression-base

  [![NPM version][npm-image]][npm-url]
  [![build status][travis-image]][travis-url]
  [![npm download][download-image]][download-url]

Base class for regression modules.  
This package is for ml.js internal use.

## Usage

You only have to implement the `_predict` method. It is always called with a number.<br />
The model should be created in the constructor.<br />
Optional methods that can be implemented: `toString`, `toLaTeX`.

```js
import BaseRegression from 'ml-regression-base';

class MyRegression extends BaseRegression {
    constructor(factor) {
        super();
        this.factor = factor;
    }
    _predict(x) {
        return x * this.factor;
    }
    toString() {
        return `f(x) = x * ${this.factor}`;
    }
}
```

### `maybeToPrecision(value, digits)`

Convenience method to transform numbers to readable strings.<br />
If digits is not specified, "value.toString()" is used. Otherwise "value.toPrecision(digits)" is used.<br />
This method can be used to implement `toString()` or `toLaTeX()`.

### `checkArrayLength(x, y)`

Convenience method to check if the input and output arrays passed to a regression
constructor are effectively arrays with the same length.

## License

  [MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/ml-regression-base.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ml-regression-base
[travis-image]: https://img.shields.io/travis/mljs/regression-base/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/mljs/regression-base
[download-image]: https://img.shields.io/npm/dm/ml-regression-base.svg?style=flat-square
[download-url]: https://npmjs.org/package/ml-regression-base
