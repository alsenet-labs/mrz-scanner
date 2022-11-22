'use strict';

const mean = require('ml-array-mean');
const groupBy = require('lodash.groupby');

const filterMAD = require('./filterOutliersMAD');

function getNumberToLetterHeightRatio(card) {
  card = card.filter((c) => c.code !== 60 && c.prediction !== '<');
  card = card.filter((c) => c.line !== 2);

  card = filterMAD(
    card,
    2.5,
    (card) => card.image.height + Math.random() * 0.01
  );
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
  const metric =
    mean(grouped.number.map((c) => c.image.height)) /
    mean(grouped.letter.map((c) => c.image.height));
  return metric;
}

module.exports = { getNumberToLetterHeightRatio };
