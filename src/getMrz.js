// @flow strict
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

function getMrz(image: typeof ImageClass) {
  try {
    return internalGetMrz(image);
  } catch (e) {
    return internalGetMrz(image.rotateLeft());
  }
}
// TODO here we need configurable with options object like { resize: 500, transform: ['grey', 'gaussianFilter', 'blackHat', 'scharrFilter'] }

function internalGetMrz(image) {
  const original = image;
  const resized = image.resize({ width: 500 });

  const originalToTreatedRatio = original.width / resized.width;

  /**
   * Converts the current image to greyscale.
   * The source image has to be RGB.
   * If there is an alpha channel we need to decide what to do:
   * * keepAlpha : we will keep the alpha channel and you will get a GREY / A image
   * * mergeAlpha : we will multiply each pixel of the image by the alpha
   * @memberof Image
   * @instance
   * @param {object} [options]
   * @param {GreyAlgorithm|GreyAlgorithmCallback} [options.algorithm='luma709'] - Algorithm to get the grey value from RGB values
   * @param {boolean} [options.keepAlpha=false] - If true, the RGB values are treated
   *          separately from the alpha channel and the method returns a GREYA image.
   * @param {boolean} [options.mergeAlpha=true] - If true, the alpha channel will be used to scale the grey pixel.
   * @param {Image} [options.out]
   * @return {Image}
   */
  const grey = resized.grey();

  /**
   * Apply a gaussian filter to the image.
   * @memberof Image
   * @instance
   * @param {object} options
   * @param {number} [options.radius=1] - Number of pixels around the current pixel.
   * @param {number} [options.sigma] - Sigma parameter for the gaussian.
   * @param {number[]|string[]} [options.channels] - To which channel to apply the filter.
   * @param {string} [options.border='copy']
   * @return {Image}
   */
  const resizedGray = grey.gaussianFilter({ radius: 1 });
  
  /**
   * This function is the black top hat (also called black hat).
   * In mathematical morphology and digital image processing,
   * top-hat transform is an operation that extracts small elements and details from given images.
   * The black top-hat transform is defined dually as the difference between the closed and the input image.
   * Top-hat transforms are used for various image processing tasks, such as feature extraction, background equalization,
   * image enhancement, and others. (Wikipedia)
   * http://docs.opencv.org/2.4/doc/tutorials/imgproc/opening_closing_hats/opening_closing_hats.html
   * @memberof Image
   * @instance
   * @param {object} [options]
   * @param {Array<Array<number>>} [options.kernel] - The kernel can only have ones and zeros. Default: [[1, 1, 1], [1, 1, 1], [1, 1, 1]]
   * @param {number} [options.iterations=1] - Number of iterations of the morphological transform
   * @return {Image}
   */
  const blackHat = resizedGray.blackHat({ kernel: rectKernel });

  /**
   * Applies the Scharr operator.
   * @memberof Image
   * @instance
   * @param {object} [options]
   * @param {GradientDirection} [options.direction]
   * @param {string} [options.border='copy']
   * @param {*} [options.channels]
   * @param {number} [options.bitDepth=this.bitDepth] Specify the bitDepth of the resulting image
   * @return {Image}
   * @see {@link https://en.wikipedia.org/wiki/Sobel_operator#Alternative_operators}
   */
  const scharrFilter = blackHat.scharrFilter({ direction: 'x', bitDepth: 32 });
  /**
   * Calculate the absolute values of an image.
   * Only works on 32-bit images.
   * @memberof Image
   * @instance
   * @param {object} [options]
   * @param {boolean} [options.inPlace=false]
   * @param {Image} [options.out]
   * @return {Image}
   */
  const abs = scharrFilter.abs();

  /** rgba8()
   * Make a copy of the current image and convert to RGBA 8 bits
   * Those images are the one that are displayed in a canvas.
   * RGB model in 8 bits per channel and containing as well an alpha channel.
   * The source image may be:
   * * a mask (binary image)
   * * a grey image (8, 16 or 32 bits) with or without alpha channel
   * * a color image (8, 16 or 32 bits) with or without alpha channel in with RGB model
   * * when the image is 32 bits, a rescaling is performed from the min and max values
   * * to map values from 0 to 255
   * The conversion is based on {@link Image#getRGBAData}.
   * @memberof Image
   * @instance
   * @return {Image} - New image in RGB color model with alpha channel
   * @example
   * var rgbaImage = image.rgba8();
   */
  const rgba8 = abs.rgba8().grey();

  /**
   * In mathematical morphology, the closing of a set A by a structuring element B is the erosion of the dilation of that set (Wikipedia).
   * In image processing, closing is, together with opening, the basic workhorse of morphological noise removal.
   * Opening removes small objects, while closing removes small holes.
   * http://docs.opencv.org/2.4/doc/tutorials/imgproc/opening_closing_hats/opening_closing_hats.html
   * @memberof Image
   * @instance
   * @param {object} [options]
   * @param {Array<Array<number>>} [options.kernel] - The kernel can only have ones and zeros. Default: [[1, 1, 1], [1, 1, 1], [1, 1, 1]]
   * @param {number} [options.iterations=1] - Number of iterations of the morphological transform
   * @return {Image}
   */
  const closeRect = rgba8.close({ kernel: rectKernel });
  
  /**
   * Creation of binary mask is based on the determination of a threshold
   * You may either choose among the provided algorithm or just specify a threshold value
   * @memberof Image
   * @instance
   * @param {object} [options]
   * @param {ThresholdAlgorithm|'threshold'} [options.algorithm='threshold']
   * @param {number} [options.threshold=0.5] - If the algorithm is 'threshold' specify here the value (0 to 1).
   * @param {boolean} [options.useAlpha=true] - Apply the alpha channel to determine the intensity of the pixel.
   * @param {boolean} [options.invert=false] - Invert the resulting image
   * @return {Image} - Binary image containing the mask
   */
  const mask = closeRect.mask({ algorithm: 'otsu' });

  // http://docs.opencv.org/2.4/doc/tutorials/imgproc/opening_closing_hats/opening_closing_hats.html
  const closeKernel = mask.close({ kernel: sqKernel });

  /**
   * Erosion is one of two fundamental operations (with dilatation) in morphological
   * image processing from which all other morphological operations are based (from Wikipedia).
   * Replaces each value with it's local minimum among the pixels with a kernel value of 1.
   * http://docs.opencv.org/2.4/doc/tutorials/imgproc/erosion_dilatation/erosion_dilatation.html
   * https://en.wikipedia.org/wiki/Erosion_(morphology)
   * @memberof Image
   * @instance
   * @param {object} [options]
   * @param {Array<Array<number>>} [options.kernel] - The kernel can only have ones and zeros. Default: [[1, 1, 1], [1, 1, 1], [1, 1, 1]]
   * @param {number} [options.iterations=1] - The number of successive erosions
   * @return {Image}
   */
  const erode = closeKernel.erode({ iterations: 4 });

  /**
   * Dilatation is one of two fundamental operations (with erosion) in morphological
   * image processing from which all other morphological operations are based (from Wikipedia).
   * Replaces each value with it's local maximum among the pixels with a kernel value of 1.
   * http://docs.opencv.org/2.4/doc/tutorials/imgproc/erosion_dilatation/erosion_dilatation.html
   * https://en.wikipedia.org/wiki/Dilation_(morphology)
   * @memberof Image
   * @instance
   * @param {object} [options]
   * @param {Array<Array<number>>} [options.kernel] - The kernel can only have ones and zeros. Default: [[1, 1, 1], [1, 1, 1], [1, 1, 1]]
   * @param {number} [options.iterations=1] - The number of successive erosions
   * @return {Image}
   */
  const dilate = erode.dilate({ iterations: 8 });

  /**
   * A manager of Regions of Interest. A RoiManager is related to a specific Image
   * and may contain multiple layers. Each layer is characterized by a label whose is
   * name by default 'default'
   * @class RoiManager
   * @param {Image} image
   * @param {object} [options]
   */
  const roiManager = resized.getRoiManager();


  /**
   * @memberof RoiManager
   * @instance
   * @param {Image} mask
   * @param {object} [options]
   * @return {RoiMap}
   */
  roiManager.fromMask(dilate);
  
  /**
   * Allows to select ROI based on size, label and sign.
   * @param {object} [options={}]
   * @param {string} [options.label='default'] Label of the layer containing the ROI
   * @param {boolean} [options.positive=true] Select the positive region of interest
   * @param {boolean} [options.negative=true] Select he negative region of interest
   * @param {number} [options.minSurface=0]
   * @param {number} [options.maxSurface=Number.POSITIVE_INFINITY]
   * @param {number} [options.minWidth=0]
   * @param {number} [options.minHeight=Number.POSITIVE_INFINITY]
   * @param {number} [options.maxWidth=0]
   * @param {number} [options.maxHeight=Number.POSITIVE_INFINITY]
   * @param {number} [options.minRatio=0] Ratio width / height
   * @param {number} [options.maxRatio=Number.POSITIVE_INFINITY]
   * @return {Roi[]}
   */
  let rois = roiManager.getRois({ minSurface: 5000 });

  /**
   * Returns an array of masks
   * See {@link Roi.getMask} for the options
   * @param {object} [options]
   * @return {Image[]} Retuns an array of masks (1 bit Image)
   */
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
