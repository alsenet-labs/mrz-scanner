'use strict';

const statsMedian = require('ml-array-median');
// const mean = require('ml-array-mean');

module.exports = function (data, threshold, accessor) {
  accessor = accessor ? accessor : (x) => x;
  threshold = threshold || 3.5;
  const newData = data.map(accessor);
  const median = statsMedian(newData);
  const diff = [];
  for (const point of newData) {
    diff.push(Math.abs(point - median));
  }
  const mad = Math.max(statsMedian(diff), 1);
  const zScore = [];
  for (const point of diff) {
    zScore.push((0.6745 * point) / mad);
  }
  //   for (let [idx, x] of zScore.entries()) {
  //     console.log(zScore[idx], newData[idx], diff[idx], mad);
  //   }
  return data.filter((point, idx) => zScore[idx] < threshold);
};
