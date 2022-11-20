'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = load;

var _fastPng = require('fast-png');

var _fastJpeg = require('fast-jpeg');

var _jpegJs = require('jpeg-js');

var _tiff = require('tiff');

var _imageType = require('image-type');

var _imageType2 = _interopRequireDefault(_imageType);

var _Image = require('../Image');

var _Image2 = _interopRequireDefault(_Image);

var _Stack = require('../../stack/Stack');

var _Stack2 = _interopRequireDefault(_Stack);

var _base = require('../../util/base64');

var _model = require('../model/model');

var _environment = require('./environment');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isDataURL = /^data:[a-z]+\/([a-z]+);base64,/;

/**
 * Load an image
 * @memberof Image
 * @static
 * @param {string|ArrayBuffer|Buffer|Uint8Array} image - URL of the image (browser, can be a dataURL) or path (Node.js)
 * or buffer containing the binary data
 * @param {object} [options] - In the browser, the options object is passed to the underlying `fetch` call.
 * @return {Promise<Image>}
 * @example
 * const image = await Image.load('https://example.com/image.png');
 */
function load(image, options) {
  if (typeof image === 'string') {
    return loadURL(image, options);
  } else if (image instanceof ArrayBuffer) {
    return Promise.resolve(loadBinary(new Uint8Array(image)));
  } else if (image.buffer) {
    return Promise.resolve(loadBinary(image));
  } else {
    throw new Error('argument to "load" must be a string or buffer.');
  }
}

function loadBinary(image, base64Url) {
  const type = (0, _imageType2.default)(image);
  if (type) {
    switch (type.mime) {
      case 'image/png':
        return loadPNG(image);
      case 'image/jpeg':
        return loadJPEG(image);
      case 'image/tiff':
        return loadTIFF(image);
      default:
        return loadGeneric(getBase64(type.mime));
    }
  }
  return loadGeneric(getBase64('application/octet-stream'));
  function getBase64(type) {
    if (base64Url) {
      return base64Url;
    } else {
      return (0, _base.toBase64URL)(image, type);
    }
  }
}

function loadURL(url, options) {
  const dataURL = url.slice(0, 64).match(isDataURL);
  let binaryDataP;
  if (dataURL !== null) {
    binaryDataP = Promise.resolve((0, _base.decode)(url.slice(dataURL[0].length)));
  } else {
    binaryDataP = (0, _environment.fetchBinary)(url, options);
  }
  return binaryDataP.then(binaryData => {
    const uint8 = new Uint8Array(binaryData);
    return loadBinary(uint8, dataURL ? url : undefined);
  });
}

function loadPNG(data) {
  const png = (0, _fastPng.decode)(data);
  const bitDepth = png.bitDepth;
  const bitmap = png.data;

  const type = png.colourType;
  let components;
  let alpha = 0;
  switch (type) {
    case 0:
      components = 1;
      break;
    case 2:
      components = 3;
      break;
    case 4:
      components = 1;
      alpha = 1;
      break;
    case 6:
      components = 3;
      alpha = 1;
      break;
    default:
      throw new Error(`Unexpected colourType: ${type}`);
  }

  return new _Image2.default(png.width, png.height, bitmap, {
    components,
    alpha,
    bitDepth
  });
}

function loadJPEG(data) {
  const decodedExif = (0, _fastJpeg.decode)(data);
  let meta;
  if (decodedExif.exif) {
    meta = getMetadata(decodedExif.exif);
  }
  const jpeg = (0, _jpegJs.decode)(data, true);
  return new _Image2.default(jpeg.width, jpeg.height, jpeg.data, { meta });
}

function loadTIFF(data) {
  let result = (0, _tiff.decode)(data);
  if (result.length === 1) {
    return getImageFromIFD(result[0]);
  } else {
    return new _Stack2.default(result.map(getImageFromIFD));
  }
}

function getMetadata(image) {
  const metadata = {
    tiff: image
  };
  if (image.exif) {
    metadata.exif = image.exif;
  }
  if (image.gps) {
    metadata.gps = image.gps;
  }
  return metadata;
}

function getImageFromIFD(image) {
  return new _Image2.default(image.width, image.height, image.data, {
    components: 1,
    alpha: 0,
    colorModel: _model.GREY,
    bitDepth: image.bitsPerSample.length ? image.bitsPerSample[0] : image.bitsPerSample,
    meta: getMetadata(image)
  });
}

function loadGeneric(url, options) {
  options = options || {};
  return new Promise(function (resolve, reject) {
    let image = new _environment.DOMImage();
    image.onload = function () {
      let w = image.width;
      let h = image.height;
      let canvas = (0, _environment.createCanvas)(w, h);
      let ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, w, h);
      let data = ctx.getImageData(0, 0, w, h).data;
      resolve(new _Image2.default(w, h, data, options));
    };
    image.onerror = function () {
      reject(new Error(`Could not load ${url}`));
    };
    image.src = url;
  });
}