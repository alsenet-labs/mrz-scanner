// @flow strict
'use strict';

// we will sort the rois per line
// we need to regroup per line
module.exports = function groupRoisPerLine(rois: Array<Object>): Array<Object> {
  const roisCopy = rois.slice();

  // we take the average height / 5
  let total = roisCopy.reduce((a, b) => (a + b.height), 0);
  const allowedShift = Math.round(total / roisCopy.length / 2);

  roisCopy.sort(function(a, b) {
    return a.minX - b.minX;
  });

  const lines = [];

  for (const roi of rois) {
    const x = roi.minX;
    const y = roi.minY;

    // is there a close line ?
    let currentLine;

    for (const line of lines) {
      if (Math.abs((line.y || 0) - y) <= allowedShift) {
        currentLine = line;
        break;
      }
    }

    if (!currentLine) {
      currentLine = { rois: [] };
      lines.push(currentLine);
    }

    // $FlowFixMe
    currentLine.y = y;
    // $FlowFixMe
    currentLine.x = x;

    currentLine.rois.push(roi);
  }

  lines.sort((a, b) => Number(a.y) - Number(b.y));

  return lines;
};
