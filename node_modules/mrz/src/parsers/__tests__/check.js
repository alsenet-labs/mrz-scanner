'use strict';

const check = require('../check');

test('check digits', () => {
  expect(() => check('592166117<231', 8)).not.toThrow();
  expect(() => check('592166111<773', 5)).not.toThrow();
  expect(() => check('592166111<773', 4)).toThrow(/invalid check digit/);
});
