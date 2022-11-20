'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sobelFilter;

var _kernels = require('../../util/kernels');

var _gradientFilter = require('./gradientFilter');

var _gradientFilter2 = _interopRequireDefault(_gradientFilter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Applies the Sobel operator.
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {GradientDirection} [options.direction]
 * @param {string} [options.border='copy']
 * @param {*} [options.channels]
 * @param {number} [options.bitDepth=this.bitDepth] Specify the bitDepth of the resulting image
 * @return {Image}
 * @see {@link https://en.wikipedia.org/wiki/Sobel_operator}
 */
function sobelFilter(options) {
  return _gradientFilter2.default.call(this, Object.assign({}, options, {
    kernelX: _kernels.SOBEL_X,
    kernelY: _kernels.SOBEL_Y
  }));
}