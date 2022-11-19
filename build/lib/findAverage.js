//       strict

module.exports = function findAverage(arr               )         {
  return arr.reduce((a, b) => a + b) / arr.length;
};
