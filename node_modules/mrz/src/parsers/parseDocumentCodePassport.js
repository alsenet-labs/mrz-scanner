'use strict';

module.exports = function parseDocumentCodePassport(source) {
  const first = source.charAt(0);
  if (first !== 'P') {
    throw new Error(
      `invalid document code: ${source}. First character must be P`,
    );
  }

  const second = source.charAt(1);
  if (!second.match(/[A-Z<]/)) {
    throw new Error(
      `invalid document code: ${source}. Second character must be a letter or <`,
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
