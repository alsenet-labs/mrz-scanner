'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = grey;

var _model = require('../model/model');

var _getOutputImage = require('../internal/getOutputImage');

var _clamp = require('../internal/clamp');

var _greyAlgorithms = require('./greyAlgorithms');

/**
 * Converts the current image to greyscale.
 * The source image has to be RGB.
 * If there is an alpha channel we need to decide what to do:
 * * keepAlpha : we will keep the alpha channel and you will get a GREY / A image
 * * mergeAlpha : we will multiply each pixel of the image by the alpha
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {GreyAlgorithm} [options.algorithm='luma709'] - Algorithm to get the grey value from RGB values
 * @param {boolean} [options.keepAlpha=false] - If true, the RGB values are treated
 *          separately from the alpha channel and the method returns a GREYA image.
 * @param {boolean} [options.mergeAlpha=true] - If true, the alpha channel will be used to scale the grey pixel.
 * @param {Image} [options.out]
 * @return {Image}
 */
function grey(options = {}) {
  let {
    algorithm = 'luma709',
    keepAlpha = false,
    mergeAlpha = true
  } = options;

  this.checkProcessable('grey', {
    bitDepth: [8, 16],
    alpha: [0, 1]
  });

  if (this.components === 1) {
    algorithm = 'red'; // actually we just take the first channel if it is a grey image
  }

  keepAlpha &= this.alpha;
  mergeAlpha &= this.alpha;
  if (keepAlpha) {
    mergeAlpha = false;
  }

  let newImage = (0, _getOutputImage.getOutputImage)(this, options, {
    components: 1,
    alpha: keepAlpha,
    colorModel: _model.GREY
  });

  let method = _greyAlgorithms.methods[algorithm.toLowerCase()];
  if (!method) {
    throw new Error(`unsupported grey algorithm: ${algorithm}`);
  }

  let ptr = 0;
  for (let i = 0; i < this.data.length; i += this.channels) {
    if (mergeAlpha) {
      newImage.data[ptr++] = (0, _clamp.clamp)(method(this.data, i, this) * this.data[i + this.components] / this.maxValue, this);
    } else {
      newImage.data[ptr++] = (0, _clamp.clamp)(method(this.data, i, this), this);
      if (newImage.alpha) {
        newImage.data[ptr++] = this.data[i + this.components];
      }
    }
  }

  return newImage;
}