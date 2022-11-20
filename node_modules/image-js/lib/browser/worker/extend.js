'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extend;

var _background = require('./process/background');

var _background2 = _interopRequireDefault(_background);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function extend(Worker) {
  Worker.extendMethod('background', _background2.default);
}