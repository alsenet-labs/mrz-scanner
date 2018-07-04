/*
* Copyright (c) 2018 ALSENET SA
*
* Author(s):
*
*      Luc Deschenaux <luc.deschenaux@freesurf.ch>
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
*/
'use strict';

var _parse = require('mrz').parse;

module.exports = {
  parse: parse
};

function parse(mrz, modified) {
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
}
