'use strict';

const { TD1 } = require('../formats');

const checkLines = require('./checkLines');
const getResult = require('./getResult');
const TD1Fields = require('./td1Fields');

module.exports = function parseTD1(lines) {
  lines = checkLines(lines);
  if (lines.length !== 3) {
    throw new Error(
      `invalid number of lines: ${lines.length}: Must be 3 for ${TD1}`,
    );
  }
  lines.forEach((line, index) => {
    if (line.length !== 30) {
      throw new Error(
        `invalid number of characters for line ${index + 1}: ${
          line.length
        }. Must be 30 for ${TD1}`,
      );
    }
  });
  return getResult(TD1, lines, TD1Fields);
};
