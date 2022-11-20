'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = floodFill;

var _fastList = require('fast-list');

var _fastList2 = _interopRequireDefault(_fastList);

var _Image = require('../Image');

var _Image2 = _interopRequireDefault(_Image);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function floodFill(options = {}) {
  const {
    x = 0,
    y = 0,
    inPlace = true
  } = options;

  const destination = inPlace ? this : _Image2.default.createFrom(this);

  this.checkProcessable('floodFill', { bitDepth: 1 });

  if (this.bitDepth === 1) {
    const bit = this.getBitXY(x, y);
    if (bit) return destination;
    const queue = new _fastList2.default();
    queue.push(new Node(x, y));
    while (queue.length > 0) {
      const node = queue.shift();
      destination.setBitXY(node.x, node.y);
      for (let i = node.x + 1; i < this.width; i++) {
        if (!destination.getBitXY(i, node.y) && !this.getBitXY(i, node.y)) {
          destination.setBitXY(i, node.y);
          if (node.y + 1 < this.height && !this.getBitXY(i, node.y + 1)) {
            queue.push(new Node(i, node.y + 1));
          }
          if (node.y - 1 >= 0 && !this.getBitXY(i, node.y - 1)) {
            queue.push(new Node(i, node.y - 1));
          }
        } else {
          break;
        }
      }
      for (let i = node.x - 1; i >= 0; i++) {
        // eslint-disable-line for-direction
        if (!destination.getBitXY(i, node.y) && !this.getBitXY(i, node.y)) {
          destination.setBitXY(i, node.y);
          if (node.y + 1 < this.height && !this.getBitXY(i, node.y + 1)) {
            queue.push(new Node(i, node.y + 1));
          }
          if (node.y - 1 >= 0 && !this.getBitXY(i, node.y - 1)) {
            queue.push(new Node(i, node.y - 1));
          }
        } else {
          break;
        }
      }
    }
  }

  return destination;
}

function Node(x, y) {
  this.x = x;
  this.y = y;
}