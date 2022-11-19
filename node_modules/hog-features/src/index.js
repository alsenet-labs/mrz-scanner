'use strict';

const processing = require('./processingHog');

const PI_RAD = 180 / Math.PI;

module.exports = {
  extractHOG: extractHOG,
  extractHistograms: extractHistograms
};

// also export all the functions from processing.js
for (var func in processing) {
  module.exports[func] = processing[func];
}

/**
 * Extract the HOG of an image
 * @param {image} image - image to transform into a HOG descriptor
 * @param {object} options
 * @return {Array} Array with the value of the HOG descriptor
 */

function extractHOG(image, options = {}) {
  const {
    blockSize = 2,
    blockStride = blockSize / 2,
    norm = 'L2'
  } = options;

  var histograms = extractHistograms(image, options);

  var blocks = [];
  var blocksHigh = histograms.length - blockSize + 1;
  var blocksWide = histograms[0].length - blockSize + 1;

  for (var y = 0; y < blocksHigh; y += blockStride) {
    for (var x = 0; x < blocksWide; x += blockStride) {
      var block = getBlock(histograms, x, y, blockSize);
      normalize(block, norm);
      blocks.push(block);
    }
  }
  return Array.prototype.concat.apply([], blocks);
}

/**
 * Extract the histogram from an image
 * @param {image} image - image to transform into a HOG descriptor
 * @param {object} options
 * @return {Array<Array<number>>} Array 2D with the histogram, based on the gradient vectors
 */

function extractHistograms(image, options = {}) {
  var vectors = processing.gradientVectors(image);

  var cellSize = options.cellSize || 4;
  var bins = options.bins || 6;

  var cellsWide = Math.floor(vectors[0].length / cellSize);
  var cellsHigh = Math.floor(vectors.length / cellSize);

  var histograms = new Array(cellsHigh);

  for (var i = 0; i < cellsHigh; i++) {
    histograms[i] = new Array(cellsWide);

    for (var j = 0; j < cellsWide; j++) {
      histograms[i][j] = getHistogram(vectors, j * cellSize, i * cellSize,
        cellSize, bins);
    }
  }
  return histograms;
}

/**
 * Extract a sqare block from a matrix
 * @param {Array<Array<number>>} matrix
 * @param {number} x
 * @param {number} y
 * @param {number} length
 * @return {Array<Array<number>>} square block extracted from the matrix
 */

function getBlock(matrix, x, y, length) {
  var square = [];
  for (var i = y; i < y + length; i++) {
    for (var j = x; j < x + length; j++) {
      square.push(matrix[i][j]);
    }
  }
  return Array.prototype.concat.apply([], square);
}

/**
 * Extract the histogram of a part of the image (a cell with coordinate x and y)
 * @param {Array<Array<number>>} elements - gradient vectors of the image
 * @param {number} x
 * @param {number} y
 * @param {number} size - cellSize
 * @param {number} bins - number of bins per histogram
 * @return {Array<number>} Array 1D with the histogram of the cell, based on the gradient vectors
 */

function getHistogram(elements, x, y, size, bins) {
  var histogram = new Array(bins).fill(0);

  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      var vector = elements[y + i][x + j];
      var bin = binFor(vector.orient, bins);
      histogram[bin] += vector.mag;
    }
  }
  return histogram;
}

function binFor(radians, bins) {
  var angle = radians * (PI_RAD);
  if (angle < 0) {
    angle += 180;
  }

  // center the first bin around 0
  angle += 90 / bins;
  angle %= 180;

  return Math.floor(angle / 180 * bins);
}

/**
 * Normalize a vector given with one of these norms : L1, L1-sqrt or L2 (norm by default). No return value, the input vector is modified.
 * @param {Array<number>} vector
 * @param {string} norm - should be "L1", "L1-sqrt" or "L2". Else, the norm will be the norm L2.
 */

function normalize(vector, norm) {
  var epsilon = 0.00001;
  var sum, denom, i;
  if (norm === 'L1') {
    sum = 0;
    for (i = 0; i < vector.length; i++) {
      sum += Math.abs(vector[i]);
    }
    denom = sum + epsilon;

    for (i = 0; i < vector.length; i++) {
      vector[i] /= denom;
    }
  } else if (norm === 'L1-sqrt') {
    sum = 0;
    for (i = 0; i < vector.length; i++) {
      sum += Math.abs(vector[i]);
    }
    denom = sum + epsilon;

    for (i = 0; i < vector.length; i++) {
      vector[i] = Math.sqrt(vector[i] / denom);
    }
  } else { // i.e norm === "L2"
    sum = 0;
    for (i = 0; i < vector.length; i++) {
      sum += vector[i] * vector[i];
    }
    denom = Math.sqrt(sum + epsilon);
    for (i = 0; i < vector.length; i++) {
      vector[i] /= denom;
    }
  }
}
