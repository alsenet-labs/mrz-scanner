'use strict';

const cleanText = require('./cleanText');

module.exports = function parseText(source, regexp = /^[0-9A-Z<]+$/) {
  if (!source.match(regexp)) {
    throw new Error(
      `invalid text: ${source}. Must match the following regular expression: ${regexp}`,
    );
  }
  return cleanText(source);
};
