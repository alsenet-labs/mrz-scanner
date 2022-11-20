//       strict
const ImageClass = require('image-js').Image;
const radiansDegrees = require('radians-degrees');
const { Matrix } = require('ml-matrix');
const {
  rotateDEG,
  translate,
  transform,
  applyToPoint,
  applyToPoints
} = require('transformation-matrix');

const rectKernel = getRectKernel(9, 5);
const sqKernel = getRectKernel(19, 19);

function getMrz(image                   ) {
  try {
    return internalGetMrz(image);
  } catch (e) {
    return internalGetMrz(image.rotateLeft());
  }
}

function internalGetMrz(image) {
  const original = image;
  const resized = image.resize({ width: 500 });

  const originalToTreatedRatio = original.width / resized.width;
  const grey = resized.grey();
  const resizedGray = grey.gaussianFilter({ radius: 1 });
  const blackHat = resizedGray.blackHat({ kernel: rectKernel });
  const scharrFilter = blackHat.scharrFilter({ direction: 'x', bitDepth: 32 });
  const abs = scharrFilter.abs();
  const rgba8 = abs.rgba8().grey();
  const closeRect = rgba8.close({ kernel: rectKernel });
  const mask = closeRect.mask({ algorithm: 'otsu' });
  const closeKernel = mask.close({ kernel: sqKernel });
  const erode = closeKernel.erode({ iterations: 4 });
  const dilate = erode.dilate({ iterations: 8 });

  const roiManager = resized.getRoiManager();

  roiManager.fromMask(dilate);
  
  let rois = roiManager.getRois({ minSurface: 5000 });
  let masks = rois.map((roi) => roi.getMask());

  rois = rois.map((roi, idx) => {
    const rect = masks[idx].minimalBoundingRectangle();
    let d1 = getDistance(rect[0], rect[1]);
    let d2 = getDistance(rect[1], rect[2]);
    let ratio;
    let pt1, pt2;
    if (d2 > d1) {
      ratio = d2 / d1;
      pt1 = rect[1];
      pt2 = rect[2];
    } else {
      ratio = d1 / d2;
      pt1 = rect[0];
      pt2 = rect[1];
    }
    if (pt1[1] < pt2[1]) {
      [pt1, pt2] = [pt2, pt1];
    }

    let angle =
      radiansDegrees(Math.atan2(pt2[1] - pt1[1], pt2[0] - pt1[0])) % 180;
    angle = -angle;

    if (angle > 90) angle -= 180;
    return {
      meta: {
        angle,
        ratio
      },
      roi: roi
    };
  });

  rois = rois.filter((roi) => checkRatio(roi.meta.ratio));
  masks = rois.map((roi) => roi.roi.getMask());

  if (rois.length === 0) {
    throw new Error('no roi found');
  }

  if (rois.length > 1) {
    rois.sort((a, b) => b.roi.surface - a.roi.surface);
  }

  let toCrop = original;

  const mrzRoi = rois[0];
  let angle = mrzRoi.meta.angle;
  let regionTransform;
  
  if (Math.abs(angle) > 45) {
    if (angle < 0) {
      toCrop = toCrop.rotateRight();
      angle += 90;
      regionTransform = transform(translate(toCrop.width, 0), rotateDEG(90));
    } else {
      toCrop = toCrop.rotateLeft();
      angle -= 90;
      regionTransform = transform(translate(0, toCrop.height), rotateDEG(-90));
    }
  }

  let mrzCropOptions;
  if (Math.abs(angle) < 1) {
    mrzCropOptions = {
      x: mrzRoi.roi.minX * originalToTreatedRatio,
      y: mrzRoi.roi.minY * originalToTreatedRatio,
      width: (mrzRoi.roi.maxX - mrzRoi.roi.minX) * originalToTreatedRatio,
      height: (mrzRoi.roi.maxY - mrzRoi.roi.minY) * originalToTreatedRatio
    };
    if (regionTransform) {
      const rotated = applyToPoint(regionTransform, mrzCropOptions);
      const tmp = mrzCropOptions.width;
      mrzCropOptions.width = mrzCropOptions.height;
      mrzCropOptions.height = tmp;
      mrzCropOptions.x = rotated.x;
      mrzCropOptions.y = rotated.y - mrzCropOptions.height;
    }
  } else {
    // convex hull relative to the original image's viewport
    let hull = mrzRoi.roi.mask.monotoneChainConvexHull().map(([x, y]) => ({
      x: (mrzRoi.roi.minX + x) * originalToTreatedRatio,
      y: (mrzRoi.roi.minY + y) * originalToTreatedRatio
    }));

    if (regionTransform) {
      hull = applyToPoints(regionTransform, hull);
    }

    const beforeRotate = toCrop;
    const afterRotate = beforeRotate.rotate(angle, {
      interpolation: 'bilinear'
    });

    const widthDiff = (afterRotate.width - beforeRotate.width) / 2;
    const heightDiff = (afterRotate.height - beforeRotate.height) / 2;

    const transformation = transform(
      translate(widthDiff, heightDiff),
      getRotationAround(beforeRotate, angle)
    );

    const rotatedHull = applyToPoints(transformation, hull);
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const point of rotatedHull) {
      if (point.x < minX) minX = point.x;
      if (point.x > maxX) maxX = point.x;
      if (point.y < minY) minY = point.y;
      if (point.y > maxY) maxY = point.y;
    }

    minX = Math.max(0, Math.round(minX));
    minY = Math.max(0, Math.round(minY));
    maxX = Math.min(afterRotate.width, Math.round(maxX));
    maxY = Math.min(afterRotate.height, Math.round(maxY));

    mrzCropOptions = {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
    toCrop = afterRotate;
  }

  if (mrzCropOptions.y < toCrop.height / 2) {
    // image is upside down, turn it back
    toCrop = toCrop.rotate(180);
    const newXY = applyToPoint(getRotationAround(toCrop, 180), mrzCropOptions);
    mrzCropOptions.x = newXY.x - mrzCropOptions.width;
    mrzCropOptions.y = newXY.y - mrzCropOptions.height;
  }

  const cropped = toCrop.crop(mrzCropOptions);

  return cropped;
}

function getRectKernel(w, h) {
  const arr = new Array(w);
  arr.fill(new Array(h).fill(1));
  return arr;
}

function checkRatio(ratio) {
  return ratio > 4 && ratio < 12;
}

function getDistance(p1, p2) {
  const dv = getDiffVector(p1, p2);
  return Math.sqrt(dv.get(0, 0) * dv.get(0, 0) + dv.get(0, 1) * dv.get(0, 1));
}

function getDiffVector(p1, p2) {
  const v1 = new Matrix([p1]);
  const v2 = new Matrix([p2]);
  const dv = v2.sub(v1);
  return dv;
}

function getRotationAround(image, angle) {
  const middle = { x: image.width / 2, y: image.height / 2 };
  return transform(
    translate(middle.x, middle.y),
    rotateDEG(angle),
    translate(-middle.x, -middle.y)
  );
}

module.exports = getMrz;
