'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extend;

var _matchAndCrop = require('./transform/matchAndCrop');

var _matchAndCrop2 = _interopRequireDefault(_matchAndCrop);

var _min = require('./compute/min');

var _min2 = _interopRequireDefault(_min);

var _max = require('./compute/max');

var _max2 = _interopRequireDefault(_max);

var _median = require('./compute/median');

var _median2 = _interopRequireDefault(_median);

var _histogram = require('./compute/histogram');

var _histogram2 = _interopRequireDefault(_histogram);

var _histograms = require('./compute/histograms');

var _histograms2 = _interopRequireDefault(_histograms);

var _average = require('./utility/average');

var _average2 = _interopRequireDefault(_average);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function extend(Stack) {
  // let inPlace = {inPlace: true};
  Stack.extendMethod('matchAndCrop', _matchAndCrop2.default);

  Stack.extendMethod('getMin', _min2.default);
  Stack.extendMethod('getMax', _max2.default);
  Stack.extendMethod('getMedian', _median2.default);
  Stack.extendMethod('getHistogram', _histogram2.default);
  Stack.extendMethod('getHistograms', _histograms2.default);

  Stack.extendMethod('getAverage', _average2.default);
} /* eslint-disable import/order */