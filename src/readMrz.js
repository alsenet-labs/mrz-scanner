'use strict';

const mrzOcr = require('./internal/mrzOcr');
const roiOptions = require('./roiOptions');

async function readMrz(image, options = {}) {
  var { ocrResult, mask, rois } = await mrzOcr(image, roiOptions);
  console.log('rois', rois);
  console.log('mask', mask);

  if (options.saveName) {
    mask.save(options.saveName);
  }

  return { rois, mrz: ocrResult };
}

module.exports = readMrz;
