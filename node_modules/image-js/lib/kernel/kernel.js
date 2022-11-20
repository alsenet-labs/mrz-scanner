'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _kernels = require('../util/kernels');

Object.keys(_kernels).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _kernels[key];
    }
  });
});

var _laplacianOfGaussian = require('./laplacianOfGaussian');

Object.defineProperty(exports, 'laplacianOfGaussian', {
  enumerable: true,
  get: function () {
    return _laplacianOfGaussian.laplacianOfGaussian;
  }
});