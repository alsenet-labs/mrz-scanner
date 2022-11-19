'use strict';

let check = require('./check');
const cleanText = require('./cleanText');

module.exports = function parsePersonalNumberCheckDigit(
  checkDigit,
  personalNumber,
) {
  const cleanNumber = cleanText(personalNumber);
  if (cleanNumber === '') {
    if (checkDigit !== '<' && checkDigit !== '0') {
      throw new Error(`invalid check digit ${checkDigit}: must be 0 or <`);
    } else {
      return checkDigit;
    }
  }
  check(personalNumber, checkDigit);
  return checkDigit;
};
