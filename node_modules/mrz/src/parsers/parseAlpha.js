'use strict';

const cleanText = require('./cleanText');

module.exports = function parseAlpha(source) {
  if (!source.match(/^[A-Z<]+$/)) {
    throw new Error(
      `invalid text: ${source}. Must be only alphabetical with <`,
    );
  }
  return cleanText(source);
};
