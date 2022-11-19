'use strict';

let parseText = require('./parseText');

module.exports = function parsePersonalNumber(source) {
  const value = parseText(source, /^[A-Z0-9<]+<*$/);
  return {
    value,
    start: 0,
    end: value.length,
  };
};
