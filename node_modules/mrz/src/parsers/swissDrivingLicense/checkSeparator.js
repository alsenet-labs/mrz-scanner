'use strict';

module.exports = function checkSeparator(source) {
  if (!source.match(/^<*$/)) {
    throw new Error(
      `invalid separator: ${source}. Must be composed only of "<"`,
    );
  }
  return source;
};
