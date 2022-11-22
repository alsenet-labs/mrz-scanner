"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPixelArray = createPixelArray;
exports.getKind = getKind;
exports.getTheoreticalPixelArraySize = getTheoreticalPixelArraySize;
exports.verifyKindDefinition = verifyKindDefinition;

var ColorModel = _interopRequireWildcard(require("../model/model"));

var Kind = _interopRequireWildcard(require("./kindNames"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const kinds = {};
kinds[Kind.BINARY] = {
  components: 1,
  alpha: 0,
  bitDepth: 1,
  colorModel: ColorModel.GREY
};
kinds[Kind.GREYA] = {
  components: 1,
  alpha: 1,
  bitDepth: 8,
  colorModel: ColorModel.GREY
};
kinds[Kind.GREY] = {
  components: 1,
  alpha: 0,
  bitDepth: 8,
  colorModel: ColorModel.GREY
};
kinds[Kind.RGBA] = {
  components: 3,
  alpha: 1,
  bitDepth: 8,
  colorModel: ColorModel.RGB
};
kinds[Kind.RGB] = {
  components: 3,
  alpha: 0,
  bitDepth: 8,
  colorModel: ColorModel.RGB
};
kinds[Kind.CMYK] = {
  components: 4,
  alpha: 0,
  bitDepth: 8,
  colorModel: ColorModel.CMYK
};
kinds[Kind.CMYKA] = {
  components: 4,
  alpha: 1,
  bitDepth: 8,
  colorModel: ColorModel.CMYK
};

function getKind(kind) {
  const result = kinds[kind];

  if (!result) {
    throw new RangeError(`invalid image kind: ${kind}`);
  }

  return result;
}

const validBitDepth = [1, 8, 16, 32];

function verifyKindDefinition(definition) {
  const {
    components,
    alpha,
    bitDepth,
    colorModel
  } = definition;

  if (!Number.isInteger(components) || components <= 0) {
    throw new RangeError(`invalid components: ${components}. Must be a positive integer`);
  }

  if (alpha !== 0 && alpha !== 1 && typeof alpha !== 'boolean') {
    throw new TypeError(`invalid alpha: ${alpha}: must be a boolean, 0 or 1`);
  }

  if (!validBitDepth.includes(bitDepth)) {
    throw new RangeError(`invalid bitDepth: ${bitDepth}. Must be one of ${validBitDepth.join(', ')}`);
  } // eslint-disable-next-line import/namespace


  if (!ColorModel[colorModel]) {
    throw new RangeError(`invalid colorModel: ${colorModel}. Must be one of ${Object.keys(ColorModel).join(', ')}`);
  }
}

function getTheoreticalPixelArraySize(size, channels, bitDepth) {
  let length = channels * size;

  if (bitDepth === 1) {
    length = Math.ceil(length / 8);
  }

  return length;
}

function createPixelArray(size, components, alpha, channels, bitDepth, maxValue) {
  const length = channels * size;
  let arr;

  switch (bitDepth) {
    case 1:
      arr = new Uint8Array(Math.ceil(length / 8));
      break;

    case 8:
      arr = new Uint8Array(length);
      break;

    case 16:
      arr = new Uint16Array(length);
      break;

    case 32:
      arr = new Float32Array(length);
      break;

    default:
      throw new Error(`Cannot create pixel array for bit depth ${bitDepth}`);
  } // alpha channel is 100% by default


  if (alpha) {
    for (let i = components; i < arr.length; i += channels) {
      arr[i] = maxValue;
    }
  }

  return arr;
}