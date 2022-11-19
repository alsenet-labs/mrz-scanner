'use strict';

let parseText = require('./parseText');

module.exports = function parseDocumentNumberOptional(
  optional,
  documentNumber,
  checkDigit,
) {
  if (checkDigit === '<') {
    const firstFiller = optional.indexOf('<');
    const value = parseText(optional.substring(firstFiller + 1));
    return {
      value,
      start: firstFiller + 1,
      end: firstFiller + 1 + value.length,
    };
  } else {
    const value = parseText(optional);
    return {
      value,
      start: 0,
      end: 0 + value.length,
    };
  }
};
