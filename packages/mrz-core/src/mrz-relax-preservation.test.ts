import { describe, expect, it } from 'vitest';
import { parse } from './mrz-relax.js';

// Entirely synthetic TD3 data. BB -> 88 changes the weighted sum by 30,
// so both document numbers satisfy the same check digit.
function checkDigit(value: string): string {
  const sum = [...value].reduce((total, char, index) => {
    const code = char === '<' ? 0 : /\d/.test(char) ? Number(char) : char.charCodeAt(0) - 55;
    return total + code * [7, 3, 1][index % 3];
  }, 0);
  return String(sum % 10);
}

function passport(documentNumber = 'BB2345678', personalNumber = '<'.repeat(14)): string[] {
  const document = documentNumber + checkDigit(documentNumber);
  const birth = '900314' + checkDigit('900314');
  const expiry = '350314' + checkDigit('350314');
  const personal = personalNumber + checkDigit(personalNumber);
  return [
    'P<USALEVI<<SARAH'.padEnd(44, '<'),
    document + 'USA' + birth + 'F' + expiry + personal + checkDigit(document + birth + expiry + personal),
  ];
}

function replaceAt(lines: string[], position: number, char: string): string[] {
  return [lines[0], lines[1].slice(0, position) + char + lines[1].slice(position + 1)];
}

describe('field-aware OCR correction', () => {
  it('keeps a checked alphanumeric document number when repairing a birth date', () => {
    const original = passport();
    expect(parse(original).valid).toBe(true);
    const input = replaceAt(original, 14, 'O');
    const result = parse(input);
    expect(result.valid).toBe(true);
    expect(result.fields.birthDate).toBe('900314');
    expect(result.fields.documentNumber).toBe('BB2345678');
    expect(result.modified).toEqual(original);
    expect(input[1][14]).toBe('O');
  });

  it('corrects a document check digit without rewriting the document number', () => {
    const original = passport();
    expect(original[1][9]).toBe('1');
    const result = parse(replaceAt(original, 9, 'I'));
    expect(result.valid).toBe(true);
    expect(result.fields.documentNumberCheckDigit).toBe('1');
    expect(result.fields.documentNumber).toBe('BB2345678');
    expect(result.modified).toEqual(original);
  });

  it('corrects a composite check digit without rewriting contributing fields', () => {
    const original = passport();
    expect(original[1][43]).toBe('0');
    const result = parse(replaceAt(original, 43, 'O'));
    expect(result.valid).toBe(true);
    expect(result.fields.documentNumber).toBe('BB2345678');
    expect(result.modified).toEqual(original);
  });

  it('keeps alphanumeric personal data when repairing another field', () => {
    const original = passport('X12345678', 'BB2345678<<<<<');
    expect(parse(original).valid).toBe(true);
    const result = parse(replaceAt(original, 14, 'O'));
    expect(result.valid).toBe(true);
    expect(result.fields.personalNumber).toBe('BB2345678');
    expect(result.modified).toEqual(original);
  });
});
