'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rotate = rotate;
exports.rotateLeft = rotateLeft;
exports.rotateRight = rotateRight;

var _Image = require('../Image');

var _Image2 = _interopRequireDefault(_Image);

var _rotateFree = require('./rotateFree');

var _rotateFree2 = _interopRequireDefault(_rotateFree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Rotates an image.
 * @memberof Image
 * @instance
 * @param {number} angle - Angle of the rotation in degrees
 * @param {object} [options]
 * @param {InterpolationAlgorithm} [options.interpolation='nearestNeighbor'] - Interpolation algorithm to use if `angle` is not a multiple of 90
 * @return {Image} The new rotated image
 */
function rotate(angle, options) {
  if (typeof angle !== 'number') {
    throw new TypeError('angle must be a number');
  }

  if (angle < 0) {
    angle = Math.ceil(-angle / 360) * 360 + angle;
  }

  switch (angle % 360) {
    case 0:
      return this.clone();
    case 90:
      return rotateRight.call(this);
    case 180:
      return rotate180.call(this);
    case 270:
      return rotateLeft.call(this);
    default:
      return _rotateFree2.default.call(this, angle, options);
  }
}

/**
 * Rotates an image counter-clockwise
 * @memberof Image
 * @instance
 * @return {Image} The new rotated image
 */
function rotateLeft() {
  const newImage = _Image2.default.createFrom(this, { width: this.height, height: this.width });
  const newMaxHeight = newImage.height - 1;
  for (let i = 0; i < this.height; i++) {
    for (let j = 0; j < this.width; j++) {
      for (let k = 0; k < this.channels; k++) {
        newImage.setValueXY(i, newMaxHeight - j, k, this.getValueXY(j, i, k));
      }
    }
  }
  return newImage;
}

/**
 * Rotates an image clockwise
 * @memberof Image
 * @instance
 * @return {Image} The new rotated image
 */

function rotateRight() {
  const newImage = _Image2.default.createFrom(this, { width: this.height, height: this.width });
  const newMaxWidth = newImage.width - 1;
  for (let i = 0; i < this.height; i++) {
    for (let j = 0; j < this.width; j++) {
      for (let k = 0; k < this.channels; k++) {
        newImage.setValueXY(newMaxWidth - i, j, k, this.getValueXY(j, i, k));
      }
    }
  }
  return newImage;
}

function rotate180() {
  const newImage = _Image2.default.createFrom(this);
  const newMaxWidth = newImage.width - 1;
  const newMaxHeight = newImage.height - 1;
  for (let i = 0; i < this.height; i++) {
    for (let j = 0; j < this.width; j++) {
      for (let k = 0; k < this.channels; k++) {
        newImage.setValueXY(newMaxWidth - j, newMaxHeight - i, k, this.getValueXY(j, i, k));
      }
    }
  }
  return newImage;
}