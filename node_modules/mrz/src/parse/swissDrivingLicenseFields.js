'use strict';

const parseNumber = require('../parsers/parseNumber');
const checkSeparator = require('../parsers/swissDrivingLicense/checkSeparator');
const parseDocumentCode = require('../parsers/swissDrivingLicense/parseDocumentCode');
const parseDocumentNumber = require('../parsers/swissDrivingLicense/parseDocumentNumber');
const parseIssuingState = require('../parsers/swissDrivingLicense/parseIssuingState');
const parseLanguageCode = require('../parsers/swissDrivingLicense/parseLanguageCode');

const createFieldParser = require('./createFieldParser');
const {
  documentNumberTemplate,
  documentCodeTemplate,
  issuingStateTemplate,
  birthDateTemplate,
  lastNameTemplate,
  firstNameTemplate,
} = require('./fieldTemplates');

module.exports = [
  Object.assign({}, documentNumberTemplate, {
    line: 0,
    start: 0,
    end: 9,
    parser: parseDocumentNumber,
  }),
  {
    label: 'Language code',
    field: 'languageCode',
    line: 0,
    start: 6,
    end: 7,
    parser: parseLanguageCode,
  },
  Object.assign({}, documentCodeTemplate, {
    line: 1,
    start: 0,
    end: 2,
    parser: parseDocumentCode,
  }),
  Object.assign({}, issuingStateTemplate, {
    line: 1,
    start: 2,
    end: 5,
    parser: parseIssuingState,
  }),
  {
    label: 'PIN code',
    field: 'pinCode',
    line: 1,
    start: 5,
    end: 14,
    parser: parseNumber,
  },
  {
    label: 'Version number',
    field: 'versionNumber',
    line: 1,
    start: 14,
    end: 17,
    parser: parseNumber,
  },
  {
    label: 'Separator 1',
    field: null,
    line: 1,
    start: 17,
    end: 19,
    parser: checkSeparator,
  },
  Object.assign({}, birthDateTemplate, {
    line: 1,
    start: 19,
    end: 25,
  }),
  {
    label: 'Separator 2',
    field: null,
    line: 1,
    start: 25,
    end: 30,
    parser: checkSeparator,
  },
  Object.assign({}, lastNameTemplate, {
    line: 2,
    start: 0,
    end: 30,
  }),
  Object.assign({}, firstNameTemplate, {
    line: 2,
    start: 0,
    end: 30,
  }),
].map(createFieldParser);
