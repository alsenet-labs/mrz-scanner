"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SOBEL_Y = exports.SOBEL_X = exports.SECOND_DERIVATIVE_INV = exports.SECOND_DERIVATIVE = exports.SCHARR_Y = exports.SCHARR_X = exports.DISCRETE_LAPLACE_8 = exports.DISCRETE_LAPLACE_4 = void 0;
const DISCRETE_LAPLACE_4 = [[0, 1, 0], [1, -4, 1], [0, 1, 0]];
exports.DISCRETE_LAPLACE_4 = DISCRETE_LAPLACE_4;
const DISCRETE_LAPLACE_8 = [[1, 1, 1], [1, -8, 1], [1, 1, 1]];
exports.DISCRETE_LAPLACE_8 = DISCRETE_LAPLACE_8;
const SOBEL_X = [[-1, 0, +1], [-2, 0, +2], [-1, 0, +1]];
exports.SOBEL_X = SOBEL_X;
const SOBEL_Y = [[-1, -2, -1], [0, 0, 0], [+1, +2, +1]];
exports.SOBEL_Y = SOBEL_Y;
const SCHARR_X = [[3, 0, -3], [10, 0, -10], [3, 0, -3]];
exports.SCHARR_X = SCHARR_X;
const SCHARR_Y = [[3, 10, 3], [0, 0, 0], [-3, -10, -3]];
exports.SCHARR_Y = SCHARR_Y;
const SECOND_DERIVATIVE = [[-1, -2, 0, 2, 1], [-2, -4, 0, 4, 2], [0, 0, 0, 0, 0], [1, 2, 0, -2, -1], [2, 4, 0, -4, -2]];
exports.SECOND_DERIVATIVE = SECOND_DERIVATIVE;
const SECOND_DERIVATIVE_INV = [[1, 2, 0, -2, -1], [2, 4, 0, -4, -2], [0, 0, 0, 0, 0], [-2, -4, 0, 4, 2], [-1, -2, 0, 2, 1]];
exports.SECOND_DERIVATIVE_INV = SECOND_DERIVATIVE_INV;