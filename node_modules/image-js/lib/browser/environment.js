"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ImageData = exports.DOMImage = void 0;
exports.createCanvas = createCanvas;
exports.createWriteStream = createWriteStream;
exports.env = void 0;
exports.fetchBinary = fetchBinary;
exports.writeFile = writeFile;
const env = 'browser';
exports.env = env;
const ImageData = self.ImageData;
exports.ImageData = ImageData;
const DOMImage = self.Image;
exports.DOMImage = DOMImage;

function createCanvas(width, height) {
  let canvas = self.document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function fetchBinary(url, {
  withCredentials = false
} = {}) {
  return new Promise(function (resolve, reject) {
    let xhr = new self.XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.withCredentials = withCredentials;

    xhr.onload = function (e) {
      if (this.status !== 200) reject(e);else resolve(this.response);
    };

    xhr.onerror = reject;
    xhr.send();
  });
}

function createWriteStream() {
  throw new Error('createWriteStream does not exist in the browser');
}

function writeFile() {
  throw new Error('writeFile does not exist in the browser');
}