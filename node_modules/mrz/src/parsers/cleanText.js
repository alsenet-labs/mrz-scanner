'use strict';

module.exports = function cleanText(string) {
  return string.replace(/<+$/g, '').replace(/</g, ' ');
};
