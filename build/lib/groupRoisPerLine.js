//       strict
'use strict';

// we will sort the rois per line
// we need to regroup per line
module.exports = function groupRoisPerLine(rois, options = {}) {
  let { allowedShift } = options;
  rois = rois.slice();

  if (!allowedShift) {
    // we take the average height / 5
    let total = 0;
    rois.forEach((a) => (total += a.height));
    allowedShift = Math.round(total / rois.length / 2);
  }

  rois.sort(function (a, b) {
    return a.minX - b.minX;
  });

  const lines = [];
  for (const roi of rois) {
    const x = roi.minX;
    const y = roi.minY;
    // is there a close line ?
    let currentLine;
    for (const line of lines) {
      if (Math.abs(line.y - y) <= allowedShift) {
        currentLine = line;
        break;
      }
    }
    if (!currentLine) {
      currentLine = { rois: [] };
      lines.push(currentLine);
    }
    currentLine.y = y;
    currentLine.x = x;
    currentLine.rois.push(roi);
  }
  lines.sort((a, b) => a.y - b.y);

  return lines;
};
