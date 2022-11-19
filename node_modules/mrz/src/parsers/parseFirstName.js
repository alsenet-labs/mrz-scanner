'use strict';

let parseText = require('./parseText');

module.exports = function parseFirstName(source) {
  const withoutStart = source.replace(/.*?<{2}/, '');
  const value = parseText(withoutStart, /^[A-Z<]+<*$/);
  const start = source.length - withoutStart.length;
  return {
    value,
    start,
    end: start + value.length,
  };
};
