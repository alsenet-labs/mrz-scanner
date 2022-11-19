'use strict';

function intensities(image) {
  if (image.components === 1) {
    return image;
  } else {
    return image.grey({ algorithm: 'luma601' });
  }
}

function gradients(imagedata) {
  return _gradients(intensities(imagedata));
}

function _gradients(intensities) {
  const height = intensities.height;
  const width = intensities.width;
  const maxValue = intensities.maxValue;

  const gradX = new Array(height);
  const gradY = new Array(height);

  for (var y = 0; y < height; y++) {
    gradX[y] = new Array(width);
    gradY[y] = new Array(width);

    for (var x = 0; x < width; x++) {
      var prevX = x === 0 ? 0 : intensities.getValueXY(x - 1, y, 1) / maxValue;
      var nextX = x === width - 1 ? 0 : intensities.getValueXY(x + 1, y, 1) / maxValue;
      var prevY = y === 0 ? 0 : intensities.getValueXY(x, y - 1, 1) / maxValue;
      var nextY = y === height - 1 ? 0 : intensities.getValueXY(x, y + 1, 1) / maxValue;

      // kernel [-1, 0, 1]
      gradX[y][x] = -prevX + nextX;
      gradY[y][x] = -prevY + nextY;
    }
  }

  return {
    x: gradX,
    y: gradY
  };
}

function gradientVectors(image) {
  return _gradientVectors(intensities(image));
}

function _gradientVectors(intensities) {
  const height = intensities.height;
  const width = intensities.width;
  const maxValue = intensities.maxValue;

  const vectors = new Array(height);

  for (var y = 0; y < height; y++) {
    vectors[y] = new Array(width);
    for (var x = 0; x < width; x++) {
      var prevX = x === 0 ? 0 : intensities.getValueXY(x - 1, y, 0) / maxValue;
      var nextX = x === width - 1 ? 0 : intensities.getValueXY(x + 1, y, 0) / maxValue;
      var prevY = y === 0 ? 0 : intensities.getValueXY(x, y - 1, 0) / maxValue;
      var nextY = y === height - 1 ? 0 : intensities.getValueXY(x, y + 1, 0) / maxValue;

      // kernel [-1, 0, 1]
      var gradX = -prevX + nextX;
      var gradY = -prevY + nextY;

      vectors[y][x] = {
        mag: Math.sqrt(Math.pow(gradX, 2) + Math.pow(gradY, 2)),
        orient: Math.atan2(gradY, gradX)
      };
    }
  }
  return vectors;
}

module.exports = {
  intensities,
  gradients,
  gradientVectors
};
