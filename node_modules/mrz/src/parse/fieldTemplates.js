'use strict';

const documentNumberTemplate = {
  label: 'Document number',
  field: 'documentNumber',
  parser: require('../parsers/parseDocumentNumber'),
};

const documentNumberCheckDigitTemplate = {
  label: 'Document number check digit',
  field: 'documentNumberCheckDigit',
  parser: require('../parsers/parseDocumentNumberCheckDigit'),
};

const documentCodeTemplate = {
  label: 'Document code',
  field: 'documentCode',
};

const nationalityTemplate = {
  label: 'Nationality',
  field: 'nationality',
  parser: require('../parsers/parseState'),
};

const sexTemplate = {
  label: 'Sex',
  field: 'sex',
  parser: require('../parsers/parseSex'),
};

const expirationDateTemplate = {
  label: 'Expiration date',
  field: 'expirationDate',
  parser: require('../parsers/parseDate'),
};

const expirationDateCheckDigitTemplate = {
  label: 'Expiration date check digit',
  field: 'expirationDateCheckDigit',
  parser: require('../parsers/parseDateCheckDigit'),
};

const compositeCheckDigitTemplate = {
  label: 'Composite check digit',
  field: 'compositeCheckDigit',
  parser: require('../parsers/parseCompositeCheckDigit'),
};

const birthDateTemplate = {
  label: 'Birth date',
  field: 'birthDate',
  parser: require('../parsers/parseDate'),
};

const birthDateCheckDigitTemplate = {
  label: 'Birth date check digit',
  field: 'birthDateCheckDigit',
  parser: require('../parsers/parseDateCheckDigit'),
};

const issueDateTemplate = {
  label: 'Issue date',
  field: 'issueDate',
  parser: require('../parsers/parseDate'),
};

const firstNameTemplate = {
  label: 'First name',
  field: 'firstName',
  parser: require('../parsers/parseFirstName'),
};

const lastNameTemplate = {
  label: 'Last name',
  field: 'lastName',
  parser: require('../parsers/parseLastName'),
};

const issuingStateTemplate = {
  label: 'Issuing state',
  field: 'issuingState',
  parser: require('../parsers/parseState'),
};

module.exports = {
  documentNumberTemplate,
  documentNumberCheckDigitTemplate,
  documentCodeTemplate,
  nationalityTemplate,
  sexTemplate,
  expirationDateTemplate,
  expirationDateCheckDigitTemplate,
  birthDateTemplate,
  birthDateCheckDigitTemplate,
  issueDateTemplate,
  compositeCheckDigitTemplate,
  firstNameTemplate,
  lastNameTemplate,
  issuingStateTemplate,
};
