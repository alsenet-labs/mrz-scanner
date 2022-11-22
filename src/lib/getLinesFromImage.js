// @flow strict
'use strict';
// $FlowFixMe
const ImageClass = require('image-js').Image;

const averege = require('./findAverage.js');
const median = require('./medianQuickSelect.js');
const groupRoisPerLine = require('./groupRoisPerLine.js');
const roiOptions = require('../roiOptions');
const fingerprintOptions = require('../fingerprintOptions');

function filterRois(rois) {
  const smallRemoved = rois.filter((roi) => roi.width !== 1 || roi.height !== 1);
  const medianSurface = median(smallRemoved.map((elem) => elem.surface));
  // $FlowFixMe
  const bigRemoved = smallRemoved.filter((roi) => roi.surface * 3 > medianSurface && roi.surface / 3 < medianSurface);

  return bigRemoved;
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

function getDistance(p1, p2) {
  return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
}

module.exports = function getLinesFromImage(image: typeof ImageClass): {
  lines: Array<Object>,
  mask: typeof ImageClass,
  painted: typeof ImageClass,
  averageSurface: number
}  {

  const grey = image.grey({ allowGrey: true });

  // we should allow to make a level without making a level ...
  let maskOptions = {
    invert: true,
    algorithm: roiOptions.algorithm,
  };
  

  let mask = grey.mask(maskOptions);
  let manager = mask.getRoiManager();
  manager.fromMask(mask);

  let rois = manager.getRois(roiOptions);

  rois = filterRois(rois);

  if (rois.length < 60) {
    mask = getMask(grey, maskOptions);
    manager = image.getRoiManager();
    manager.fromMask(mask);
    rois = manager.getRois(roiOptions);
    rois = filterRois(rois);
  }

  const averageSurface = averege(rois.map((elem) => elem.surface));

  const painted = manager.paint(roiOptions);

  rois.forEach(function (roi) {
    const small = roi.getMask().scale({
      width: fingerprintOptions.width,
      height: fingerprintOptions.height
    });
    
    roi.data = Array.from(small.data);

    // draw bounding boxes
    const mask = roi.getMask();
    let mbr = mask.minimalBoundingRectangle();
    
    // roi.mbr = mbr;
    
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
    lines: groupRoisPerLine(rois),
    painted,
    mask,
    averageSurface
  };
};