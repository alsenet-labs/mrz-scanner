'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = monotoneChainConvexHull;

var _monotoneChainConvexHull = require('monotone-chain-convex-hull');

var _monotoneChainConvexHull2 = _interopRequireDefault(_monotoneChainConvexHull);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns the convex hull of a binary image
 * @memberof Image
 * @instance
 * @return {Array<Array<number>>}
 */
function monotoneChainConvexHull() {
  const image = this;
  image.checkProcessable('monotoneChainConvexHull', { bitDepth: 1 });

  const points = image.getPoints();

  return (0, _monotoneChainConvexHull2.default)(points, { sorted: true });
}