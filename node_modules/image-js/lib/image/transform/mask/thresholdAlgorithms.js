'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.names = exports.methods = undefined;

var _huang = require('./huang');

var _huang2 = _interopRequireDefault(_huang);

var _intermodes = require('./intermodes');

var _intermodes2 = _interopRequireDefault(_intermodes);

var _isodata = require('./isodata');

var _isodata2 = _interopRequireDefault(_isodata);

var _li = require('./li');

var _li2 = _interopRequireDefault(_li);

var _maxEntropy = require('./maxEntropy');

var _maxEntropy2 = _interopRequireDefault(_maxEntropy);

var _mean = require('./mean');

var _mean2 = _interopRequireDefault(_mean);

var _minError = require('./minError');

var _minError2 = _interopRequireDefault(_minError);

var _minimum = require('./minimum');

var _minimum2 = _interopRequireDefault(_minimum);

var _moments = require('./moments');

var _moments2 = _interopRequireDefault(_moments);

var _otsu = require('./otsu');

var _otsu2 = _interopRequireDefault(_otsu);

var _percentile = require('./percentile');

var _percentile2 = _interopRequireDefault(_percentile);

var _renyiEntropy = require('./renyiEntropy.js');

var _renyiEntropy2 = _interopRequireDefault(_renyiEntropy);

var _shanbhag = require('./shanbhag');

var _shanbhag2 = _interopRequireDefault(_shanbhag);

var _triangle = require('./triangle');

var _triangle2 = _interopRequireDefault(_triangle);

var _yen = require('./yen');

var _yen2 = _interopRequireDefault(_yen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {('huang'|'intermodes'|'isodata'|'li'|'maxentropy'|'mean'|'minerror'|'minimum'|'moments'|'otsu'|'percentile'|'renyientropy'|'shanbhag'|'triangle'|'yen')} ThresholdAlgorithm
 */

const methods = exports.methods = {
  huang: _huang2.default,
  intermodes: _intermodes2.default,
  isodata: _isodata2.default,
  li: _li2.default,
  maxentropy: _maxEntropy2.default,
  mean: _mean2.default,
  minerror: _minError2.default,
  minimum: _minimum2.default,
  moments: _moments2.default,
  otsu: _otsu2.default,
  percentile: _percentile2.default,
  renyientropy: _renyiEntropy2.default,
  shanbhag: _shanbhag2.default,
  triangle: _triangle2.default,
  yen: _yen2.default
};

const names = exports.names = {};
Object.keys(methods).forEach(name => {
  names[name] = name;
});