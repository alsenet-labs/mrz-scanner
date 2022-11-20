'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fromPoints;

var _RoiMap = require('../RoiMap');

var _RoiMap2 = _interopRequireDefault(_RoiMap);

var _Shape = require('../../../util/Shape');

var _Shape2 = _interopRequireDefault(_Shape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @memberof RoiManager
 * @instance
 * @param {Array<Array<number>>} pointsToPaint - an array of points
 * @param {object} [options]
 * @return {RoiMap}
 */
function fromPoints(pointsToPaint, options = {}) {
  let shape = new _Shape2.default(options);

  // based on a binary image we will create plenty of small images
  let data = new Int16Array(this.size); // maxValue: 32767, minValue: -32768
  let positiveID = 0;
  let shapePoints = shape.getPoints();
  for (let i = 0; i < pointsToPaint.length; i++) {
    positiveID++;
    let xP = pointsToPaint[i][0];
    let yP = pointsToPaint[i][1];
    for (let j = 0; j < shapePoints.length; j++) {
      let xS = shapePoints[j][0];
      let yS = shapePoints[j][1];
      if (xP + xS >= 0 && yP + yS >= 0 && xP + xS < this.width && yP + yS < this.height) {
        data[xP + xS + (yP + yS) * this.width] = positiveID;
      }
    }
  }

  return new _RoiMap2.default(this, data);
}