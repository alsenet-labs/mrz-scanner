// @flow strict

module.exports = function findAverage(arr: Array<number>): number {
  return arr.reduce((a, b) => a + b) / arr.length;
};
