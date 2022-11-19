'use strict';

module.exports = function parseNumber(source) {
  if (!source.match(/^[0-9]+$/)) {
    throw new Error(`invalid number: ${source}`);
  }

  return source;
};
