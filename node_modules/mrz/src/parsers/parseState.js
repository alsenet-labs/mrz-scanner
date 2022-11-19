'use strict';

const STATES = require('../generated/states');

const cleanText = require('./cleanText');

module.exports = function parseState(source) {
  source = cleanText(source);
  let state = STATES[source];
  if (!state) {
    throw new Error(`invalid state code: ${source}`);
  }
  return {
    value: source,
    start: 0,
    end: source.length,
  };
};
