'use strict';

function checkLines(lines) {
  if (typeof lines === 'string') {
    lines = lines.split(/[\r\n]+/);
  }
  if (!Array.isArray(lines)) {
    throw new TypeError('input must be an array or string');
  }
  for (const line of lines) {
    if (!line.match(/[A-Z0-9<]+/)) {
      throw new TypeError(
        'lines must be composed of only alphanumerical characters and "<"',
      );
    }
  }
  return lines;
}

module.exports = checkLines;
