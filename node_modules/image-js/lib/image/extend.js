'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extend;

var _abs = require('./filter/abs');

var _abs2 = _interopRequireDefault(_abs);

var _invert = require('./filter/invert');

var _invert2 = _interopRequireDefault(_invert);

var _flipX = require('./filter/flipX');

var _flipX2 = _interopRequireDefault(_flipX);

var _flipY = require('./filter/flipY');

var _flipY2 = _interopRequireDefault(_flipY);

var _blurFilter = require('./filter/blurFilter');

var _blurFilter2 = _interopRequireDefault(_blurFilter);

var _medianFilter = require('./filter/medianFilter');

var _medianFilter2 = _interopRequireDefault(_medianFilter);

var _gaussianFilter = require('./filter/gaussianFilter');

var _gaussianFilter2 = _interopRequireDefault(_gaussianFilter);

var _sobelFilter = require('./filter/sobelFilter');

var _sobelFilter2 = _interopRequireDefault(_sobelFilter);

var _scharrFilter = require('./filter/scharrFilter');

var _scharrFilter2 = _interopRequireDefault(_scharrFilter);

var _gradientFilter = require('./filter/gradientFilter');

var _gradientFilter2 = _interopRequireDefault(_gradientFilter);

var _level = require('./filter/level');

var _level2 = _interopRequireDefault(_level);

var _add = require('./filter/add');

var _add2 = _interopRequireDefault(_add);

var _subtract = require('./filter/subtract');

var _subtract2 = _interopRequireDefault(_subtract);

var _subtractImage = require('./filter/subtractImage');

var _subtractImage2 = _interopRequireDefault(_subtractImage);

var _hypotenuse = require('./filter/hypotenuse');

var _hypotenuse2 = _interopRequireDefault(_hypotenuse);

var _multiply = require('./filter/multiply');

var _multiply2 = _interopRequireDefault(_multiply);

var _divide = require('./filter/divide');

var _divide2 = _interopRequireDefault(_divide);

var _background = require('./filter/background');

var _background2 = _interopRequireDefault(_background);

var _dilate = require('./morphology/dilate');

var _dilate2 = _interopRequireDefault(_dilate);

var _erode = require('./morphology/erode');

var _erode2 = _interopRequireDefault(_erode);

var _open = require('./morphology/open');

var _open2 = _interopRequireDefault(_open);

var _close = require('./morphology/close');

var _close2 = _interopRequireDefault(_close);

var _topHat = require('./morphology/topHat');

var _topHat2 = _interopRequireDefault(_topHat);

var _blackHat = require('./morphology/blackHat');

var _blackHat2 = _interopRequireDefault(_blackHat);

var _morphologicalGradient = require('./morphology/morphologicalGradient');

var _morphologicalGradient2 = _interopRequireDefault(_morphologicalGradient);

var _warping = require('./transform/warping');

var _warping2 = _interopRequireDefault(_warping);

var _crop = require('./transform/crop');

var _crop2 = _interopRequireDefault(_crop);

var _cropAlpha = require('./transform/cropAlpha');

var _cropAlpha2 = _interopRequireDefault(_cropAlpha);

var _resize = require('./transform/resize/resize');

var _resize2 = _interopRequireDefault(_resize);

var _hsv = require('./transform/hsv');

var _hsv2 = _interopRequireDefault(_hsv);

var _hsl = require('./transform/hsl');

var _hsl2 = _interopRequireDefault(_hsl);

var _cmyk = require('./transform/cmyk');

var _cmyk2 = _interopRequireDefault(_cmyk);

var _rgba = require('./transform/rgba8');

var _rgba2 = _interopRequireDefault(_rgba);

var _grey = require('./transform/grey');

var _grey2 = _interopRequireDefault(_grey);

var _mask = require('./transform/mask/mask');

var _mask2 = _interopRequireDefault(_mask);

var _pad = require('./transform/pad');

var _pad2 = _interopRequireDefault(_pad);

var _colorDepth = require('./transform/colorDepth');

var _colorDepth2 = _interopRequireDefault(_colorDepth);

var _rotate = require('./transform/rotate');

var _insert = require('./transform/insert');

var _insert2 = _interopRequireDefault(_insert);

var _setBorder = require('./utility/setBorder');

var _setBorder2 = _interopRequireDefault(_setBorder);

var _split = require('./utility/split');

var _split2 = _interopRequireDefault(_split);

var _getChannel = require('./utility/getChannel');

var _getChannel2 = _interopRequireDefault(_getChannel);

var _combineChannels = require('./utility/combineChannels');

var _combineChannels2 = _interopRequireDefault(_combineChannels);

var _setChannel = require('./utility/setChannel');

var _setChannel2 = _interopRequireDefault(_setChannel);

var _getSimilarity = require('./utility/getSimilarity');

var _getSimilarity2 = _interopRequireDefault(_getSimilarity);

var _getPixelsGrid = require('./utility/getPixelsGrid');

var _getPixelsGrid2 = _interopRequireDefault(_getPixelsGrid);

var _getBestMatch = require('./utility/getBestMatch');

var _getBestMatch2 = _interopRequireDefault(_getBestMatch);

var _getRow = require('./utility/getRow');

var _getRow2 = _interopRequireDefault(_getRow);

var _getColumn = require('./utility/getColumn');

var _getColumn2 = _interopRequireDefault(_getColumn);

var _getMatrix = require('./utility/getMatrix');

var _getMatrix2 = _interopRequireDefault(_getMatrix);

var _setMatrix = require('./utility/setMatrix');

var _setMatrix2 = _interopRequireDefault(_setMatrix);

var _getPixelsArray = require('./utility/getPixelsArray');

var _getPixelsArray2 = _interopRequireDefault(_getPixelsArray);

var _getIntersection = require('./utility/getIntersection');

var _getIntersection2 = _interopRequireDefault(_getIntersection);

var _getClosestCommonParent = require('./utility/getClosestCommonParent');

var _getClosestCommonParent2 = _interopRequireDefault(_getClosestCommonParent);

var _getThreshold = require('./utility/getThreshold');

var _getThreshold2 = _interopRequireDefault(_getThreshold);

var _cannyEdge = require('./operator/cannyEdge');

var _cannyEdge2 = _interopRequireDefault(_cannyEdge);

var _convolution = require('./operator/convolution');

var _convolution2 = _interopRequireDefault(_convolution);

var _extract = require('./operator/extract');

var _extract2 = _interopRequireDefault(_extract);

var _floodFill = require('./operator/floodFill');

var _floodFill2 = _interopRequireDefault(_floodFill);

var _paintLabels = require('./operator/paintLabels');

var _paintLabels2 = _interopRequireDefault(_paintLabels);

var _paintMasks = require('./operator/paintMasks');

var _paintMasks2 = _interopRequireDefault(_paintMasks);

var _paintPoints = require('./operator/paintPoints');

var _paintPoints2 = _interopRequireDefault(_paintPoints);

var _paintPolyline = require('./operator/paintPolyline');

var _paintPolyline2 = _interopRequireDefault(_paintPolyline);

var _paintPolylines = require('./operator/paintPolylines');

var _paintPolylines2 = _interopRequireDefault(_paintPolylines);

var _paintPolygon = require('./operator/paintPolygon');

var _paintPolygon2 = _interopRequireDefault(_paintPolygon);

var _paintPolygons = require('./operator/paintPolygons');

var _paintPolygons2 = _interopRequireDefault(_paintPolygons);

var _histogram = require('./compute/histogram');

var _colorHistogram = require('./compute/colorHistogram');

var _colorHistogram2 = _interopRequireDefault(_colorHistogram);

var _min = require('./compute/min');

var _min2 = _interopRequireDefault(_min);

var _max = require('./compute/max');

var _max2 = _interopRequireDefault(_max);

var _sum = require('./compute/sum');

var _sum2 = _interopRequireDefault(_sum);

var _moment = require('./compute/moment');

var _moment2 = _interopRequireDefault(_moment);

var _localMaxima = require('./compute/localMaxima');

var _localMaxima2 = _interopRequireDefault(_localMaxima);

var _mean = require('./compute/mean');

var _mean2 = _interopRequireDefault(_mean);

var _median = require('./compute/median');

var _median2 = _interopRequireDefault(_median);

var _points = require('./compute/points');

var _points2 = _interopRequireDefault(_points);

var _relativePosition = require('./compute/relativePosition');

var _relativePosition2 = _interopRequireDefault(_relativePosition);

var _svd = require('./compute/svd');

var _svd2 = _interopRequireDefault(_svd);

var _countAlphaPixels = require('./compute/countAlphaPixels');

var _countAlphaPixels2 = _interopRequireDefault(_countAlphaPixels);

var _monotoneChainConvexHull = require('./compute/monotoneChainConvexHull');

var _monotoneChainConvexHull2 = _interopRequireDefault(_monotoneChainConvexHull);

var _minimalBoundingRectangle = require('./compute/minimalBoundingRectangle');

var _minimalBoundingRectangle2 = _interopRequireDefault(_minimalBoundingRectangle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// operators


// utility


// transforms
function extend(Image) {
  let inPlace = { inPlace: true };

  Image.extendMethod('invert', _invert2.default);
  Image.extendMethod('abs', _abs2.default);
  Image.extendMethod('level', _level2.default, inPlace);
  Image.extendMethod('add', _add2.default, inPlace);
  Image.extendMethod('subtract', _subtract2.default, inPlace);
  Image.extendMethod('subtractImage', _subtractImage2.default);
  Image.extendMethod('multiply', _multiply2.default, inPlace);
  Image.extendMethod('divide', _divide2.default, inPlace);
  Image.extendMethod('hypotenuse', _hypotenuse2.default);
  Image.extendMethod('background', _background2.default);
  Image.extendMethod('flipX', _flipX2.default);
  Image.extendMethod('flipY', _flipY2.default);

  Image.extendMethod('blurFilter', _blurFilter2.default);
  Image.extendMethod('medianFilter', _medianFilter2.default);
  Image.extendMethod('gaussianFilter', _gaussianFilter2.default);
  Image.extendMethod('sobelFilter', _sobelFilter2.default);
  Image.extendMethod('gradientFilter', _gradientFilter2.default);
  Image.extendMethod('scharrFilter', _scharrFilter2.default);

  Image.extendMethod('dilate', _dilate2.default);
  Image.extendMethod('erode', _erode2.default);
  Image.extendMethod('open', _open2.default);
  Image.extendMethod('close', _close2.default);
  Image.extendMethod('topHat', _topHat2.default);
  Image.extendMethod('blackHat', _blackHat2.default);
  Image.extendMethod('morphologicalGradient', _morphologicalGradient2.default);

  Image.extendMethod('warpingFourPoints', _warping2.default);
  Image.extendMethod('crop', _crop2.default);
  Image.extendMethod('cropAlpha', _cropAlpha2.default);
  Image.extendMethod('resize', _resize2.default).extendMethod('scale', _resize2.default);
  Image.extendMethod('hsv', _hsv2.default);
  Image.extendMethod('hsl', _hsl2.default);
  Image.extendMethod('cmyk', _cmyk2.default);
  Image.extendMethod('rgba8', _rgba2.default);
  Image.extendMethod('grey', _grey2.default).extendMethod('gray', _grey2.default);
  Image.extendMethod('mask', _mask2.default);
  Image.extendMethod('pad', _pad2.default);
  Image.extendMethod('colorDepth', _colorDepth2.default);
  Image.extendMethod('setBorder', _setBorder2.default, inPlace);
  Image.extendMethod('rotate', _rotate.rotate);
  Image.extendMethod('rotateLeft', _rotate.rotateLeft);
  Image.extendMethod('rotateRight', _rotate.rotateRight);
  Image.extendMethod('insert', _insert2.default);

  Image.extendMethod('getRow', _getRow2.default);
  Image.extendMethod('getColumn', _getColumn2.default);
  Image.extendMethod('getMatrix', _getMatrix2.default);
  Image.extendMethod('setMatrix', _setMatrix2.default);
  Image.extendMethod('getPixelsArray', _getPixelsArray2.default);
  Image.extendMethod('getIntersection', _getIntersection2.default);
  Image.extendMethod('getClosestCommonParent', _getClosestCommonParent2.default);
  Image.extendMethod('getThreshold', _getThreshold2.default);

  Image.extendMethod('split', _split2.default);
  Image.extendMethod('getChannel', _getChannel2.default);
  Image.extendMethod('combineChannels', _combineChannels2.default);
  Image.extendMethod('setChannel', _setChannel2.default);
  Image.extendMethod('getSimilarity', _getSimilarity2.default);
  Image.extendMethod('getPixelsGrid', _getPixelsGrid2.default);
  Image.extendMethod('getBestMatch', _getBestMatch2.default);

  Image.extendMethod('cannyEdge', _cannyEdge2.default);
  Image.extendMethod('convolution', _convolution2.default);
  Image.extendMethod('extract', _extract2.default);
  Image.extendMethod('floodFill', _floodFill2.default);
  Image.extendMethod('paintLabels', _paintLabels2.default, inPlace);
  Image.extendMethod('paintMasks', _paintMasks2.default, inPlace);
  Image.extendMethod('paintPoints', _paintPoints2.default, inPlace);
  Image.extendMethod('paintPolyline', _paintPolyline2.default, inPlace);
  Image.extendMethod('paintPolylines', _paintPolylines2.default, inPlace);
  Image.extendMethod('paintPolygon', _paintPolygon2.default, inPlace);
  Image.extendMethod('paintPolygons', _paintPolygons2.default, inPlace);

  Image.extendMethod('countAlphaPixels', _countAlphaPixels2.default);
  Image.extendMethod('monotoneChainConvexHull', _monotoneChainConvexHull2.default);
  Image.extendMethod('minimalBoundingRectangle', _minimalBoundingRectangle2.default);
  Image.extendMethod('getHistogram', _histogram.getHistogram).extendProperty('histogram', _histogram.getHistogram);
  Image.extendMethod('getHistograms', _histogram.getHistograms).extendProperty('histograms', _histogram.getHistograms);
  Image.extendMethod('getColorHistogram', _colorHistogram2.default).extendProperty('colorHistogram', _colorHistogram2.default);
  Image.extendMethod('getMin', _min2.default).extendProperty('min', _min2.default);
  Image.extendMethod('getMax', _max2.default).extendProperty('max', _max2.default);
  Image.extendMethod('getSum', _sum2.default).extendProperty('sum', _sum2.default);
  Image.extendMethod('getMoment', _moment2.default).extendProperty('moment', _moment2.default);
  Image.extendMethod('getLocalMaxima', _localMaxima2.default);
  Image.extendMethod('getMedian', _median2.default).extendProperty('median', _median2.default);
  Image.extendMethod('getMean', _mean2.default).extendProperty('mean', _mean2.default);
  Image.extendMethod('getPoints', _points2.default).extendProperty('points', _points2.default);
  Image.extendMethod('getRelativePosition', _relativePosition2.default);
  Image.extendMethod('getSvd', _svd2.default).extendProperty('svd', _svd2.default);
}

// computers


// morphology transforms
/* eslint-disable import/order */

// filters