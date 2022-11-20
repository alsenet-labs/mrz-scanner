'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cannyEdge;

var _cannyEdgeDetector = require('canny-edge-detector');

var _cannyEdgeDetector2 = _interopRequireDefault(_cannyEdgeDetector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @return {Image}
 */
function cannyEdge(options) {
  return (0, _cannyEdgeDetector2.default)(this, options);
}