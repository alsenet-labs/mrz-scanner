'use strict';

module.exports = function parseLanguageCode(languageCode) {
  switch (languageCode) {
    case 'D':
    case 'F':
    case 'I':
    case 'R':
      return languageCode;
    default:
      throw new Error(
        `invalid languageCode code: ${languageCode}. Must be D, F, I or R`,
      );
  }
};
