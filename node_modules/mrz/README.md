# mrz

Parse MRZ (Machine Readable Zone) from identity documents.

<h3 align="center">

  <a href="https://www.zakodium.com">
    <img src="https://www.zakodium.com/brand/zakodium-logo-white.svg" width="50" alt="Zakodium logo" />
  </a>

  <p>
    Maintained by <a href="https://www.zakodium.com">Zakodium</a>
  </p>

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![npm download][download-image]][download-url]

</h3>

## Installation

`$ npm install mrz`

## Example

```js
const parse = require('mrz').parse;

let mrz = [
  'I<UTOD23145890<1233<<<<<<<<<<<',
  '7408122F1204159UTO<<<<<<<<<<<6',
  'ERIKSSON<<ANNA<MARIA<<<<<<<<<<',
];

var result = parse(mrz);
console.log(result);
```

## API

### parse(mrz)

Parses the provided MRZ. The argument can be an array of lines or a single string
including line breaks. This function throws an error if the input is in an
unsupported format. It will never throw an error when there are invalid fields
in the MRZ. Instead, the `result.valid` value will be `false` and
details about the invalid fields can be found in `result.details`.

#### result.format

String identifying the format of the parsed MRZ. Supported formats are:

- TD1 (identity card with three MRZ lines)
- TD2 (identity card with two MRZ lines)
- TD3 (passport)
- SWISS_DRIVING_LICENSE
- FRENCH_NATIONAL_ID

#### result.valid

`true` if all fields are valid. `false` otherwise.

#### result.fields

Object mapping field names to their respective value. The value is set to `null`
if it is invalid. The value may be different than the raw value. For example
`result.fields.sex` will be "male" when the raw value was "M".

#### result.details

Array of objects describing all parsed fields. Its structure is:

- label {string} - Full english term for the field.
- field {string} - Name of the field in `result.fields`.
- value {string} - Value of the field or `null`.
- valid {boolean}
- ranges {Array} - Array of ranges that are necessary to compute this field.
  Ranges are objects with `line`, `start`, `end` and `raw`.
- line {number} - Index of the line where the field is located.
- start {number} - Index of the start of the field in `line`.
- end {number} - Index of the end of the field in `line`.

### formats

Static mapping of supported formats.

### states

Static mapping of state code to state name.

## Specifications

### TD1, TD2 and TD3

https://www.icao.int/publications/pages/publication.aspx?docnum=9303

### Swiss driving license

http://www.astra2.admin.ch/media/pdfpub/2003-10-15_2262_f.pdf

### French national id

https://fr.wikipedia.org/wiki/Carte_nationale_d%27identit%C3%A9_en_France#Codage_Bande_MRZ_(lecture_optique)

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/mrz.svg
[npm-url]: https://npmjs.org/package/mrz
[ci-image]: https://github.com/cheminfo/mrz/workflows/Node.js%20CI/badge.svg?branch=master
[ci-url]: https://github.com/cheminfo/mrz/actions?query=workflow%3A%22Node.js+CI%22
[download-image]: https://img.shields.io/npm/dm/mrz.svg
[download-url]: https://npmjs.org/package/mrz
