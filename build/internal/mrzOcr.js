//       strict

const ImageClass = require('image-js').Image;
const getLinesFromImage = require('../lib/getLinesFromImage.js');
const { predictImages } = require('../svm');

async function mrzOcr(image                   ) {
  let rois;
  
  const { lines, mask, painted, averageSurface } = getLinesFromImage(image);

  // A line should have at least 5 ROIS (swiss driving license)
  let filteredLines = lines.filter((line) => line.rois.length > 5).slice(lines.length - 3, lines.length);
  console.log('filteredLines', filteredLines);

  let ocrResult = [];

  rois = [];
  for (let i = 0; i < filteredLines.length; i++) {
    const line = filteredLines[i];
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
  console.log('predicted', predicted);

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
