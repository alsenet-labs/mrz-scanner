'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkNumberArray = checkNumberArray;

var _isArrayType = require('is-array-type');

var _isArrayType2 = _interopRequireDefault(_isArrayType);

var _Image = require('../image/Image');

var _Image2 = _interopRequireDefault(_Image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function checkNumberArray(value) {
  if (!isNaN(value)) {
    if (value <= 0) {
      throw new Error('checkNumberArray: the value must be greater than 0');
    }
    return value;
  } else {
    if (value instanceof _Image2.default) {
      return value.data;
    }
    if (!(0, _isArrayType2.default)(value)) {
      throw new Error('checkNumberArray: the value should be either a number, array or Image');
    }
    return value;
  }
}