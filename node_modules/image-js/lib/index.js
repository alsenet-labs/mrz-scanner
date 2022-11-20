'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Worker = exports.Static = exports.Shape = exports.Stack = exports.Image = exports.default = exports.Kernel = undefined;

var _Stack = require('./stack/Stack');

Object.defineProperty(exports, 'Stack', {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_Stack).default;
  }
});

var _Shape = require('./util/Shape');

Object.defineProperty(exports, 'Shape', {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_Shape).default;
  }
});

var _worker = require('./worker/worker');

Object.defineProperty(exports, 'Worker', {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_worker).default;
  }
});

var _Image = require('./image/Image');

var _Image2 = _interopRequireDefault(_Image);

var _kernel = require('./kernel/kernel');

var Kernel = _interopRequireWildcard(_kernel);

var _greyAlgorithms = require('./image/transform/greyAlgorithms');

var _thresholdAlgorithms = require('./image/transform/mask/thresholdAlgorithms');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Kernel = Kernel;
exports.default = _Image2.default;
exports.Image = _Image2.default;
const Static = exports.Static = {
  grey: _greyAlgorithms.names,
  threshold: _thresholdAlgorithms.names
};