'use strict';

module.exports = function parseDocumentCodeId(source) {
  const first = source.charAt(0);
  if (first !== 'A' && first !== 'C' && first !== 'I') {
    throw new Error(
      `invalid document code: ${source}. First character must be A, C or I`,
    );
  }

  const second = source.charAt(1);
  if (second === 'V') {
    throw new Error(
      `invalid document code: ${source}. Second character may not be V`,
    );
  }

  if (second === '<') {
    return {
      value: first,
      start: 0,
      end: 1,
    };
  } else {
    return source;
  }
};
