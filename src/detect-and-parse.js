// @flow strict
// $FlowFixMe
const ImageClass = require('image-js').Image;
const getMrz = require('./getMrz');
const mrzOcr = require('./internal/mrzOcr');
// $FlowFixMe
const { DateTime: luxon } = require('luxon');

const parse = require('./mrz-relax');


const getOptions = (value: any): Options => (typeof value === 'object' && !Array.isArray(value) && value !== null) ? value : {};

type Options = {
  original?: boolean,
}

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
};

type Result =
  {
    number: string,
    validDate: string,
    birthDate: string,
    name: string,
    surname: string,
  } | {
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

module.exports = async function detectAndParseMrz(buffer: Buffer, options?: ?Options): Promise<?Result> {
  try {
    const { original } = getOptions(options);

    const mrz = await getMrz(await ImageClass.load(buffer));
    const imageDataUrl = mrz.toDataURL();
    const toImage = await ImageClass.load(imageDataUrl);
    var { ocrResult } = await mrzOcr(toImage);
    const parsed = parse(ocrResult);

    const formattedResult = original ? parsed : {
      number: parsed.fields.documentNumber,
      validDate: luxon.fromFormat(parsed.fields.expirationDate, 'yyMMdd').toISODate(),
      birthDate: luxon.fromFormat(parsed.fields.birthDate, 'yyMMdd').toISODate(),
      name: parsed.fields.firstName.replace(/\s+/g, '').trim(),
      surname: parsed.fields.lastName.replace(/\s+/g, '').trim(),
    };

    return formattedResult;
  } catch (e) {
    console.log(e);
  }

};
