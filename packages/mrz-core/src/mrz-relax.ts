import { parse as mrzParse, type ParseResult as MrzParseResult } from 'mrz';

export interface ParseResult extends MrzParseResult {
  modified?: string[];
}

// Common OCR confusions for MRZ characters, grouped by field type.
// Digits that look like letters and vice versa.
const DIGIT_SUBSTITUTIONS: Array<[RegExp, string]> = [
  [/O/gi, '0'],
  [/[lI]/g, '1'],
  [/S/gi, '5'],
  [/g/g, '9'],
  [/B/g, '8'],
  [/Z/g, '2'],
  [/D/g, '0'],
];

const ALPHA_SUBSTITUTIONS: Array<[RegExp, string]> = [
  [/0/g, 'O'],
  [/1/g, 'I'],
  [/5/g, 'S'],
  [/8/g, 'B'],
  [/2/g, 'Z'],
];

export function parse(mrz: string[], modified = false): ParseResult {
  const lines = mrz.slice();
  const result = mrzParse(lines) as ParseResult;
  let retry = false;

  for (const d of result.details) {
    if (d.valid) continue;

    const isNumericField = /date|digit|check/i.test(d.label);
    const isAlphaField = /name|state|nation/i.test(d.label);
    const subs = isNumericField
      ? DIGIT_SUBSTITUTIONS
      : isAlphaField
        ? ALPHA_SUBSTITUTIONS
        : null;

    if (!subs) continue;

    // Related ranges contribute to validation, but do not inherit this
    // field's character class. A check digit can depend on an already-valid
    // alphanumeric document/personal number; never rewrite those characters
    // as digits just because the check failed. Their own details handle any
    // type-specific corrections.
    const ranges =
      d.ranges.length > 0
        ? d.ranges.slice(0, 1)
        : [{ line: d.line, start: d.start, end: d.end }];

    for (const range of ranges) {
      const original = lines[range.line].substring(range.start, range.end);
      let fixed = original;
      for (const [pattern, replacement] of subs) {
        fixed = fixed.replace(pattern, replacement);
      }
      if (fixed !== original) {
        lines[range.line] =
          lines[range.line].substring(0, range.start) +
          fixed +
          lines[range.line].substring(range.end);
        retry = true;
      }
    }
  }

  if (retry) {
    return parse(lines, true);
  }

  if (modified) {
    result.modified = lines;
  }
  return result;
}
