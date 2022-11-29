# mrz-scanner

Server side mrz scanner.

Using [mrz-detection](https://github.com/image-js/mrz-detection) written for NodeJS by [Daniel Kostro](https://github.com/stropitek) and [Michaël Zasso](https://github.com/targos).

Based on [mrz-scanner](https://github.com/alsenet-labs/mrz-scanner)

Refactored by [ProjectINT](https://github.com/ProjectINT) because original package was to big for lambda function

# Install

```
yarn add mrz-scan
      OR
npm i mrz-scan
```

# Get formatted response

```js
// @flow
const mrzScanner = require('mrz-scan');

type Result = ?{ // undefined if errored
  number: string,
  validDate: string,
  birthDate: string,
  name: string,
  surname: string,
};

// Pass [Buffer](https://nodejs.org/api/buffer.html) to mrzScanner
const result: Result = await mrzScanner(Buffer);

```
# Or you can get all fields with original === true option

```js
// @flow
const mrzScanner = require('mrz-scan');

type Fields = {
  documentCode: string,
  issuingState: string,
  lastName: string,
  firstName: string,
  documentNumber: string,
  documentNumberCheckDigit: string,
  nationality: string,
  birthDate: string,
  birthDateCheckDigit: string,
  sex: string,
  expirationDate: string,
  expirationDateCheckDigit: string,
  personalNumber: string,
  personalNumberCheckDigit: string,
  compositeCheckDigit: string,
}

type FullResult = ?{ // undefined if errored
  format: string, // TD1, TD2, TD3
  details: Array<{
    label: string,
    field: $Values<Fields>,
    value: string,
    valid: boolean,
    ranges: Array<[number, number]>,
    line: number,
    start: number,
    end: number,
  }>,
  fields: Fields,
  valid: boolean,
}

const fullResult: FullResult = const result = await mrzScanner(Buffer, { original: true });

```

## Supported image formats

Supported image formats
The following formats can be loaded by image-js:

* PNG (8 or 16 bits, color or greyscale, with or without alpha)
* JPEG
* TIFF (8 or 16 bits, greyscale)

