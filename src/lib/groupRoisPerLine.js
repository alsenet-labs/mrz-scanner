// @flow strict
'use strict';

// we will sort the rois per line
// we need to regroup per line
module.exports = function groupRoisPerLine(rois: Array<Object>) {
  const roisCopy = rois.slice();

  // we take the average height / 5
  let total = roisCopy.reduce((a, b) => (a + b.height), 0);
  console.log('total', total);

  const allowedShift = Math.round(total / rois.length / 2);

  console.log('allowedShift', allowedShift);
  console.log('rois.length', rois.length);

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
      if (Math.abs(line.y - y) <= allowedShift) {
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

  lines.sort((a, b) => a.y - b.y);

  return lines;
};
