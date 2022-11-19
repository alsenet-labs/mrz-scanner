'use strict';

module.exports = function parseIssuingState(source) {
  if (source !== 'CHE' && source !== 'LIE') {
    throw new Error(`invalid state code: ${source}. Must be CHE or LIE`);
  }
  return source;
};
