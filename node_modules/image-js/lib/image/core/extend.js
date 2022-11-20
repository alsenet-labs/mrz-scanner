'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extendMethod = extendMethod;
exports.extendProperty = extendProperty;

var _hasOwn = require('has-own');

var _hasOwn2 = _interopRequireDefault(_hasOwn);

var _Image = require('../Image');

var _Image2 = _interopRequireDefault(_Image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let computedPropertyDescriptor = {
  configurable: true,
  enumerable: false,
  get: undefined
};

function extendMethod(name, method, options = {}) {
  let {
    inPlace = false,
    returnThis = true,
    partialArgs = []
  } = options;

  if (inPlace) {
    _Image2.default.prototype[name] = function (...args) {
      // remove computed properties
      this.computed = null;
      let result = method.apply(this, [...partialArgs, ...args]);
      if (returnThis) {
        return this;
      }
      return result;
    };
  } else {
    _Image2.default.prototype[name] = function (...args) {
      return method.apply(this, [...partialArgs, ...args]);
    };
  }
  return _Image2.default;
}

function extendProperty(name, method, options = {}) {
  let {
    partialArgs = []
  } = options;

  computedPropertyDescriptor.get = function () {
    if (this.computed === null) {
      this.computed = {};
    } else if ((0, _hasOwn2.default)(name, this.computed)) {
      return this.computed[name];
    }
    let result = method.apply(this, partialArgs);
    this.computed[name] = result;
    return result;
  };
  Object.defineProperty(_Image2.default.prototype, name, computedPropertyDescriptor);
  return _Image2.default;
}