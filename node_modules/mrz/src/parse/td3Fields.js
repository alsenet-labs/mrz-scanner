'use strict';

const parseDocumentCode = require('../parsers/parseDocumentCodePassport');
const parsePersonalNumber = require('../parsers/parsePersonalNumber');
const parsePersonalNumberCheckDigit = require('../parsers/parsePersonalNumberCheckDigit');

const createFieldParser = require('./createFieldParser');
const {
  documentCodeTemplate,
  issuingStateTemplate,
  lastNameTemplate,
  firstNameTemplate,
  documentNumberTemplate,
  documentNumberCheckDigitTemplate,
  nationalityTemplate,
  birthDateTemplate,
  birthDateCheckDigitTemplate,
  sexTemplate,
  expirationDateTemplate,
  expirationDateCheckDigitTemplate,
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
    end: 44,
  }),
  Object.assign({}, firstNameTemplate, {
    line: 0,
    start: 5,
    end: 44,
  }),
  Object.assign({}, documentNumberTemplate, {
    line: 1,
    start: 0,
    end: 9,
  }),
  Object.assign({}, documentNumberCheckDigitTemplate, {
    line: 1,
    start: 9,
    end: 10,
    related: [
      {
        line: 1,
        start: 0,
        end: 9,
      },
    ],
  }),
  Object.assign({}, nationalityTemplate, {
    line: 1,
    start: 10,
    end: 13,
  }),
  Object.assign({}, birthDateTemplate, {
    line: 1,
    start: 13,
    end: 19,
  }),
  Object.assign({}, birthDateCheckDigitTemplate, {
    line: 1,
    start: 19,
    end: 20,
    related: [
      {
        line: 1,
        start: 13,
        end: 19,
      },
    ],
  }),
  Object.assign({}, sexTemplate, {
    line: 1,
    start: 20,
    end: 21,
  }),
  Object.assign({}, expirationDateTemplate, {
    line: 1,
    start: 21,
    end: 27,
  }),
  Object.assign({}, expirationDateCheckDigitTemplate, {
    line: 1,
    start: 27,
    end: 28,
    related: [
      {
        line: 1,
        start: 21,
        end: 27,
      },
    ],
  }),
  {
    label: 'Personal number',
    field: 'personalNumber',
    line: 1,
    start: 28,
    end: 42,
    parser: parsePersonalNumber,
  },
  {
    label: 'Personal number check digit',
    field: 'personalNumberCheckDigit',
    line: 1,
    start: 42,
    end: 43,
    related: [
      {
        line: 1,
        start: 28,
        end: 42,
      },
    ],
    parser: parsePersonalNumberCheckDigit,
  },
  Object.assign({}, compositeCheckDigitTemplate, {
    line: 1,
    start: 43,
    end: 44,
    related: [
      {
        line: 1,
        start: 0,
        end: 10,
      },
      {
        line: 1,
        start: 13,
        end: 20,
      },
      {
        line: 1,
        start: 21,
        end: 43,
      },
    ],
  }),
].map(createFieldParser);
