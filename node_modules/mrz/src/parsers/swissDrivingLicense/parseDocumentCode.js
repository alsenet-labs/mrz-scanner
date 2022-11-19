'use strict';

module.exports = function parseDocumentCode(source) {
  if (source !== 'FA') {
    throw new Error(`invalid document code: ${source}. Must be FA`);
  }
  return source;
};
