'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = substractImage;

var _channel = require('../../util/channel');

var _Image = require('../Image');

var _Image2 = _interopRequireDefault(_Image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Calculate a new image that is the substraction between the current image and the otherImage.
 * @memberof Image
 * @instance
 * @param {Image} otherImage
 * @param {object} [options={}]
 * @param {number} [options.bitDepth=this.bitDepth]
 * @param {number[]|string[]} [options.channels] : to which channel to apply the filter. By default all but alpha.
 * @return {Image}
 */
function substractImage(otherImage, options = {}) {
  let { bitDepth = this.bitDepth, channels, absolute = false } = options;
  this.checkProcessable('substractImage', {
    bitDepth: [8, 16]
  });
  if (this.width !== otherImage.width || this.height !== otherImage.height) {
    throw new Error('substractImage: both images must have the same size');
  }
  if (this.alpha !== otherImage.alpha || this.bitDepth !== otherImage.bitDepth) {
    throw new Error('substractImage: both images must have the same alpha and bitDepth');
  }
  if (this.channels !== otherImage.channels) {
    throw new Error('substractImage: both images must have the same number of channels');
  }

  let newImage = _Image2.default.createFrom(this, { bitDepth: bitDepth });

  channels = (0, _channel.validateArrayOfChannels)(this, { channels: channels });

  for (let j = 0; j < channels.length; j++) {
    let c = channels[j];
    for (let i = c; i < this.data.length; i += this.channels) {
      let value = this.data[i] - otherImage.data[i];
      if (absolute) {
        newImage.data[i] = Math.abs(value);
      } else {
        newImage.data[i] = Math.max(value, 0);
      }
    }
  }

  return newImage;
}