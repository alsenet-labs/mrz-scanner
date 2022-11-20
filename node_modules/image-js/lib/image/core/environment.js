'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeFile = exports.createWriteStream = exports.DOMImage = exports.ImageData = exports.createCanvas = exports.env = undefined;
exports.fetchBinary = fetchBinary;

var _fs = require('fs');

const message = 'requires the canvas library. Install it with `npm install canvas@next`.';

// eslint-disable-next-line import/no-mutable-exports
let createCanvas, DOMImage, ImageData;
try {
  const canvas = require('canvas');
  exports.createCanvas = createCanvas = canvas.createCanvas;
  exports.DOMImage = DOMImage = canvas.Image;
  exports.ImageData = ImageData = canvas.ImageData;
} catch (e) {
  exports.createCanvas = createCanvas = function () {
    throw new Error(`createCanvas ${message}`);
  };
  exports.DOMImage = DOMImage = function () {
    throw new Error(`DOMImage ${message}`);
  };
  exports.ImageData = ImageData = function () {
    throw new Error(`ImageData ${message}`);
  };
}

const env = exports.env = 'node';

function fetchBinary(path) {
  return new Promise(function (resolve, reject) {
    (0, _fs.readFile)(path, function (err, data) {
      if (err) reject(err);else resolve(data.buffer);
    });
  });
}

exports.createCanvas = createCanvas;
exports.ImageData = ImageData;
exports.DOMImage = DOMImage;
exports.createWriteStream = _fs.createWriteStream;
exports.writeFile = _fs.writeFile;