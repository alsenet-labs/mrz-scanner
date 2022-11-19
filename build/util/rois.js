'use strict';

const mean = require('ml-array-mean');
const groupBy = require('lodash.groupby');

const filterMAD = require('./filterOutliersMAD');

function getNumberToLetterHeightRatio(card) {
  // Filter < char for they can be smaller in some fonts
  card = card.filter((c) => c.code !== 60 && c.prediction !== '<');
  // only keep first two lines (not clear why it helps but it does)
  card = card.filter((c) => c.line !== 2);

  // console.log('length after filter', card.length);
  // console.log(card.length);
  // console.log(card.map((c) => c.image.height));
  // console.log('length before MAD filtering', card.length);
  card = filterMAD(
    card,
    2.5,
    // Math.random part is to avoid dividing by zero in certain situations
    (card) => card.image.height + Math.random() * 0.01
  );
  // console.log('length after MAD filtering', card.length);
  const grouped = groupBy(card, (c) => {
    const character = c.char || c.predicted;
    const code = character.charCodeAt(0);
    if (code >= 38 && code <= 57) {
      return 'number';
    } else if (code >= 65 && code <= 90) {
      return 'letter';
    } else {
      return 'other';
    }
  });

  grouped.letter = grouped.letter || [];
  grouped.number = grouped.number || [];
  // console.log('number of numbers', grouped.number.length);
  // console.log('number of letters', grouped.letter.length);
  // console.log('other', grouped.other ? grouped.other.length : 0);
  const metric =
    mean(grouped.number.map((c) => c.image.height)) /
    mean(grouped.letter.map((c) => c.image.height));
  // console.log(cardKey, metric);
  // features.push(metric);
  return metric;
  // console.log(card.map((c) => ({ height: c.image.height, c: c.char })));
  // separate chars and
  // features.push([getCharHeightRatioDescriptor(card.map((c) => c.image))]);
}

module.exports = { getNumberToLetterHeightRatio };
