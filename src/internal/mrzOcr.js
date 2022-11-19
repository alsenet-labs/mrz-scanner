'use strict';

const getLinesFromImage = require('../lib/getLinesFromImage.js');

const { predictImages } = require('../svm');

async function mrzOcr(image, roiOptions = {}) {
  let rois;
  roiOptions = Object.assign({}, { method: 'svm' }, roiOptions);
  
  let { lines, mask, painted, averageSurface } = getLinesFromImage(image, roiOptions);

  // A line should have at least 5 ROIS (swiss driving license)
  lines = lines.filter((line) => line.rois.length > 5);

  // we keep maximum the last 3 lines
  if (lines.length > 3) {
    lines = lines.slice(lines.length - 3, lines.length);
  }

  let ocrResult = [];

  rois = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.rois.length; j++) {
      const roi = line.rois[j];
      rois.push({
        image: image.crop({
          x: roi.minX,
          y: roi.minY,
          width: roi.width,
          height: roi.height
        }),
        width: roi.width,
        height: roi.height,
        line: i,
        column: j
      });
    }
  }

  let predicted = await predictImages(rois.map((roi) => roi.image), 'ESC-v2');
  predicted = predicted.map((p) => String.fromCharCode(p));
  predicted.forEach((p, idx) => {
    rois[idx].predicted = p;
  });
  let count = 0;
  for (let line of lines) {
    let lineText = '';
    for (let i = 0; i < line.rois.length; i++) {
      lineText += predicted[count++];
    }
    ocrResult.push(lineText);
  }

  return {
    rois,
    ocrResult,
    mask,
    painted,
    averageSurface
  };
}

module.exports = mrzOcr;
