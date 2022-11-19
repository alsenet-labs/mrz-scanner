'use strict';

module.exports = function parseSex(source) {
  switch (source) {
    case 'M':
      return 'male';
    case 'F':
      return 'female';
    case '<':
      return 'nonspecified';
    default:
      throw new Error(`invalid sex: ${source}. Must be M, F or <.`);
  }
};
