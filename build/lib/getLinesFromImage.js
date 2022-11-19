//       strict
'use strict';

const ImageClass = require('image-js').Image;

const averege = require('./findAverage.js');
const median = require('./medianQuickSelect.js');
const groupRoisPerLine = require('./groupRoisPerLine.js');
const roiOptions = require('../roiOptions');
const fingerprintOptions = require('../fingerprintOptions');

module.exports = function getLinesFromImage(image                   )  {

  var grey = image.grey({ allowGrey: true });

  // we should allow to make a level without making a level ...
  let maskOptions = {
    invert: true,
    algorithm: null,
    threshold: null,
  };
  if (roiOptions.algorithm) {
    maskOptions.algorithm = roiOptions.algorithm;
  } else if (roiOptions.greyThreshold) {
    let greyThreshold = roiOptions.greyThreshold;
    if (roiOptions.level) {
      // we simulate the level by changing the threshold
      greyThreshold = (grey.min[0] + (grey.max[0] - grey.min[0]) * greyThreshold) / grey.maxValue;
    }
    maskOptions.threshold = greyThreshold;
  } else {
    throw new Error('no algorithm or greyThreshold provided to apply.');
  }

  var mask = grey.mask(maskOptions);
  var manager = image.getRoiManager();
  manager.fromMask(mask);
  var rois = manager.getRois(roiOptions);
  rois = filterRois(rois);

  if (rois.length < 60) {
    mask = getMask(grey, maskOptions);
    manager = image.getRoiManager();
    manager.fromMask(mask);
    rois = manager.getRois(roiOptions);
    rois = filterRois(rois);
  }

  var averageSurface = averege(rois.map((elem) => elem.surface));

  var painted = manager.paint(roiOptions);

  rois.forEach(function (roi) {
    var small = roi.getMask().scale({
      width: fingerprintOptions.width,
      height: fingerprintOptions.height
    });
    roi.data = Array.from(small.data);

    // draw bounding boxes
    var mask = roi.getMask();
    var mbr = mask.minimalBoundingRectangle();
    roi.mbr = mbr;
    roi.mbrWidth = getDistance(mbr[0], mbr[1]);
    roi.mbrHeight = getDistance(mbr[1], mbr[2]);
    roi.mbrSurface = roi.mbrWidth * roi.mbrHeight;
    roi.fillingFactor = roi.surface / roi.mbrSurface;

    mbr = mbr.map((point) => [
      point[0] + mask.position[0],
      point[1] + mask.position[1]
    ]);
    painted.paintPolyline(mbr, { color: [255, 0, 0] });
  });

  return {
    lines: groupRoisPerLine(rois, roiOptions),
    painted,
    mask,
    averageSurface
  };
};

function getDistance(p1, p2) {
  return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
}

function getMask(image, maskOptions) {
  let mask = new ImageClass(image.width, image.height, { kind: 'BINARY' });
  const partsY = 1;
  const partsX = 30;
  const h = Math.floor(image.height / partsY);
  const w = Math.floor(image.width / partsX);
  for (let i = 0; i < partsX; i++) {
    for (let j = 0; j < partsY; j++) {
      let x = i * w;
      let y = j * h;
      let width = w;
      let height = h;
      if (i === partsX - 1) {
        width += image.width % partsX;
      }
      if (j === partsY - 1) {
        height += image.height % partsY;
      }
      const params = {
        x,
        y,
        width,
        height
      };
      const imagePart = image.crop(params).mask(maskOptions);
      mask.insert(imagePart, { inPlace: true, x: x, y: y });
    }
  }
  return mask;
}

function filterRois(rois) {
  rois = rois.filter((roi) => roi.width !== 1 || roi.height !== 1);
  var medianSurface = median(rois.map((elem) => elem.surface));
  rois = rois.filter(
    (roi) => roi.surface * 3 > medianSurface && roi.surface / 3 < medianSurface
  );

  return rois;
}