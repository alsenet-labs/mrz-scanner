'use strict';

module.exports = function createFieldParser(fieldOptions) {
  checkType(fieldOptions, 'label', 'string');
  if (fieldOptions.field !== null) {
    checkType(fieldOptions, 'field', 'string');
  }
  checkType(fieldOptions, 'line', 'number');
  checkType(fieldOptions, 'start', 'number');
  checkType(fieldOptions, 'end', 'number');
  checkType(fieldOptions, 'parser', 'function');

  const ranges = [
    {
      line: fieldOptions.line,
      start: fieldOptions.start,
      end: fieldOptions.end,
    },
  ];
  if (Array.isArray(fieldOptions.related)) {
    for (const related of fieldOptions.related) {
      checkType(related, 'line', 'number');
      checkType(related, 'start', 'number');
      checkType(related, 'end', 'number');
      ranges.push(related);
    }
  }

  return function parseField(lines) {
    const source = getText(lines, fieldOptions);
    let related = fieldOptions.related || [];
    related = related.map((r) => getText(lines, r));
    const result = {
      label: fieldOptions.label,
      field: fieldOptions.field,
      value: null,
      valid: false,
      ranges: ranges.map((range) => ({
        line: range.line,
        start: range.start,
        end: range.end,
        raw: getText(lines, range),
      })),
    };
    const range = result.ranges[0];
    result.line = range.line;
    result.start = range.start;
    result.end = range.end;
    try {
      let parsed = fieldOptions.parser(source, ...related);
      result.value = typeof parsed === 'object' ? parsed.value : parsed;
      result.valid = true;
      if (typeof parsed === 'object') {
        result.start = range.start + parsed.start;
        result.end = range.start + parsed.end;
      }
    } catch (e) {
      result.error = e.message;
    }
    return result;
  };
};

function getText(lines, options) {
  const line = lines[options.line];
  return line.substring(options.start, options.end);
}

function checkType(options, name, type) {
  if (typeof options[name] !== type) {
    throw new TypeError(`${name} must be a ${type}`);
  }
}
