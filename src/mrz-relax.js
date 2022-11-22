'use strict';

var _parse = require('mrz').parse;


module.exports = function parse(mrz, modified) {
  var _mrz = mrz.slice(0);
  var result = _parse(_mrz);
  var retry;

  result.details.forEach(function (d) {
    if (!d.valid) {
      if (d.label.search(/date|digit|number/) >= 0) {
        let v0 = _mrz[d.line].substr(d.start, d.end - d.start);
        let v = v0.replace(/O/gi, '0');
        v = v.replace(/l|I/g, '1');
        v = v.replace(/S/gi, '5');
        v = v.replace(/g/, '9');
        if (v != v0) {
          _mrz[d.line] = _mrz[d.line].substr(0, d.start) + v + _mrz[d.line].substr(d.end);
          retry = true;
        }
      } else if (d.label.search(/name|state|Nation/) >= 0) {
        let v0 = _mrz[d.line].substr(d.start, d.end - d.start);
        let v = v0.replace(/0/g, 'O');
        v = v.replace(/1/g, 'I');
        v = v.replace(/5/g, 'S');
        if (v != v0) {
          _mrz[d.line] = _mrz[d.line].substr(0, d.start) + v + _mrz[d.line].substr(d.end);
          retry = true;
        }
      }
    }
  });

  if (retry) {
    return parse(_mrz, true);
  } else {
    if (modified) {
      result.modified = _mrz;
    }
    return result;
  }
};
