'use strict';

function getDetails(lines, fieldParsers) {
  const details = [];
  for (const parser of fieldParsers) {
    details.push(parser(lines));
  }
  return details;
}

function getFields(details) {
  const fields = {};
  let valid = true;
  for (const detail of details) {
    if (!detail.valid) valid = false;
    if (detail.field) {
      fields[detail.field] = detail.value;
    }
  }
  return { fields, valid };
}

function getResult(format, lines, fieldParsers) {
  const details = getDetails(lines, fieldParsers);
  const fields = getFields(details);
  const result = {
    format,
    details,
    fields: fields.fields,
    valid: fields.valid,
  };
  return result;
}

module.exports = getResult;
