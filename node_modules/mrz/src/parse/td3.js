'use strict';

const { TD3 } = require('../formats');

const checkLines = require('./checkLines');
const getResult = require('./getResult');
const TD3Fields = require('./td3Fields');

module.exports = function parseTD3(lines) {
  lines = checkLines(lines);
  if (lines.length !== 2) {
    throw new Error(
      `invalid number of lines: ${lines.length}: Must be 2 for ${TD3}`,
    );
  }
  lines.forEach((line, index) => {
    if (line.length !== 44) {
      throw new Error(
        `invalid number of characters for line ${index + 1}: ${
          line.length
        }. Must be 44 for TD3`,
      );
    }
  });
  return getResult(TD3, lines, TD3Fields);
};
