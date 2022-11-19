'use strict';

const parseDocumentCode = require('../parsers/parseDocumentCodeId');
const parseOptional = require('../parsers/parseOptional');

const createFieldParser = require('./createFieldParser');
const {
  documentCodeTemplate,
  issuingStateTemplate,
  firstNameTemplate,
  lastNameTemplate,
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
    end: 36,
  }),
  Object.assign({}, firstNameTemplate, {
    line: 0,
    start: 5,
    end: 36,
  }),
  Object.assign({}, documentNumberTemplate, {
    line: 1,
    start: 0,
    end: 9,
    related: [
      {
        line: 1,
        start: 9,
        end: 10,
      },
      {
        line: 1,
        start: 28,
        end: 35,
      },
    ],
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
      {
        line: 1,
        start: 28,
        end: 35,
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
    label: 'Optional field',
    field: 'optional',
    line: 1,
    start: 28,
    end: 35,
    parser: parseOptional,
  },
  Object.assign({}, compositeCheckDigitTemplate, {
    line: 1,
    start: 35,
    end: 36,
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
        end: 35,
      },
    ],
  }),
].map(createFieldParser);
