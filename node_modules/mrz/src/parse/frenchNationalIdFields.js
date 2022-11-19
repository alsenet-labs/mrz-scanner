'use strict';

const parseAlpha = require('../parsers/parseAlpha');
const parseDocumentCode = require('../parsers/parseDocumentCodeId');
const parseOptional = require('../parsers/parseOptional');

const createFieldParser = require('./createFieldParser');
const {
  documentCodeTemplate,
  issuingStateTemplate,
  lastNameTemplate,
  issueDateTemplate,
  firstNameTemplate,
  documentNumberTemplate,
  documentNumberCheckDigitTemplate,
  birthDateTemplate,
  birthDateCheckDigitTemplate,
  sexTemplate,
  compositeCheckDigitTemplate,
} = require('./fieldTemplates');

module.exports = [
  Object.assign({}, documentCodeTemplate, {
    line: 0,
    start: 0,
    end: 2,
    parser: parseDocumentCode,
  }),
  Object.assign({}, issuingStateTemplate, {
    line: 0,
    start: 2,
    end: 5,
  }),
  Object.assign({}, lastNameTemplate, {
    line: 0,
    start: 5,
    end: 30,
    parser: parseAlpha,
  }),
  {
    label: 'Administrative code',
    field: 'administrativeCode',
    line: 0,
    start: 30,
    end: 36,
    parser: parseOptional,
  },
  Object.assign({}, issueDateTemplate, {
    line: 1,
    start: 0,
    end: 4,
  }),
  {
    label: 'Administrative code 2',
    field: 'administrativeCode2',
    line: 1,
    start: 4,
    end: 7,
    parser: parseOptional,
  },
  Object.assign({}, documentNumberTemplate, {
    line: 1,
    start: 7,
    end: 12,
  }),
  Object.assign({}, documentNumberCheckDigitTemplate, {
    line: 1,
    start: 12,
    end: 13,
    related: [
      {
        line: 1,
        start: 0,
        end: 12,
      },
    ],
  }),
  Object.assign({}, firstNameTemplate, {
    line: 1,
    start: 13,
    end: 27,
    parser: parseAlpha,
  }),
  Object.assign({}, birthDateTemplate, {
    line: 1,
    start: 27,
    end: 33,
  }),
  Object.assign({}, birthDateCheckDigitTemplate, {
    line: 1,
    start: 33,
    end: 34,
    related: [
      {
        line: 1,
        start: 27,
        end: 33,
      },
    ],
  }),
  Object.assign({}, sexTemplate, {
    line: 1,
    start: 34,
    end: 35,
  }),
  Object.assign({}, compositeCheckDigitTemplate, {
    line: 1,
    start: 35,
    end: 36,
    related: [
      {
        line: 0,
        start: 0,
        end: 36,
      },
      {
        line: 1,
        start: 0,
        end: 35,
      },
    ],
  }),
].map(createFieldParser);
