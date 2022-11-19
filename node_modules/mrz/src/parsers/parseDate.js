'use strict';

module.exports = function parseDate(value) {
  if (!value.match(/^[0-9<]{4,6}$/)) {
    throw new Error(`invalid date: ${value}`);
  }

  const month = value.substring(2, 4);
  if (month !== '<<' && (month < 1 || month > 12)) {
    throw new Error(`invalid date month: ${month}`);
  }

  if (value.length === 6) {
    const day = value.substring(4, 6);
    if (day !== '<<' && (day < 1 || day > 31)) {
      throw new Error(`invalid date day: ${day}`);
    }
  }

  return value;
};
