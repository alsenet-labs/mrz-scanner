'use strict';

const parse = require('../parse');

describe('parse TD3', () => {
  it('Utopia example', () => {
    const MRZ = [
      'P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<',
      'L898902C36UTO7408122F1204159ZE184226B<<<<<10',
    ];

    const result = parse(MRZ);
    expect(result).toMatchObject({
      valid: false,
      format: 'TD3',
    });
    expect(result.valid).toBe(false);
    const errors = result.details.filter((a) => !a.valid);
    expect(errors).toHaveLength(2);
    expect(result.fields).toStrictEqual({
      documentCode: 'P',
      firstName: 'ANNA MARIA',
      lastName: 'ERIKSSON',
      documentNumber: 'L898902C3',
      documentNumberCheckDigit: '6',
      nationality: null,
      sex: 'female',
      expirationDate: '120415',
      expirationDateCheckDigit: '9',
      personalNumber: 'ZE184226B',
      personalNumberCheckDigit: '1',
      birthDate: '740812',
      birthDateCheckDigit: '2',
      issuingState: null,
      compositeCheckDigit: '0',
    });

    const personalNumberDetails = result.details.find(
      (d) => d.field === 'personalNumber',
    );
    expect(personalNumberDetails).toStrictEqual({
      label: 'Personal number',
      field: 'personalNumber',
      value: 'ZE184226B',
      valid: true,
      ranges: [{ line: 1, start: 28, end: 42, raw: 'ZE184226B<<<<<' }],
      line: 1,
      start: 28,
      end: 37,
    });

    expect(errors[0]).toStrictEqual({
      label: 'Issuing state',
      field: 'issuingState',
      value: null,
      valid: false,
      ranges: [{ line: 0, start: 2, end: 5, raw: 'UTO' }],
      line: 0,
      start: 2,
      end: 5,
      error: 'invalid state code: UTO',
    });
  });

  it('German example', () => {
    const MRZ = [
      'P<D<<MUSTERMANN<<ERIKA<<<<<<<<<<<<<<<<<<<<<<',
      'C01X0006H1D<<6408125F1710319<<<<<<<<<<<<<<<0',
    ];

    const result = parse.TD3(MRZ);
    expect(result.valid).toBe(true);
    expect(result.fields).toStrictEqual({
      documentCode: 'P',
      issuingState: 'D',
      lastName: 'MUSTERMANN',
      firstName: 'ERIKA',
      documentNumber: 'C01X0006H',
      documentNumberCheckDigit: '1',
      nationality: 'D',
      birthDate: '640812',
      birthDateCheckDigit: '5',
      sex: 'female',
      expirationDate: '171031',
      expirationDateCheckDigit: '9',
      personalNumber: '',
      personalNumberCheckDigit: '<',
      compositeCheckDigit: '0',
    });
  });

  it('No last name', () => {
    const MRZ = [
      'P<IND<<FIRST<NAME<<<<<<<<<<<<<<<<<<<<<<<<<<<',
      'C01X0006H1D<<6408125F1710319<<<<<<<<<<<<<<<0',
    ];

    const result = parse.TD3(MRZ);
    expect(result.valid).toBe(true);
    expect(result.fields).toStrictEqual({
      documentCode: 'P',
      issuingState: 'IND',
      lastName: '',
      firstName: 'FIRST NAME',
      documentNumber: 'C01X0006H',
      documentNumberCheckDigit: '1',
      nationality: 'D',
      birthDate: '640812',
      birthDateCheckDigit: '5',
      sex: 'female',
      expirationDate: '171031',
      expirationDateCheckDigit: '9',
      personalNumber: '',
      personalNumberCheckDigit: '<',
      compositeCheckDigit: '0',
    });
  });
});
