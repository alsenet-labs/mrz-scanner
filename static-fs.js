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
"use strict";

var fs=require('fs');
var textEncoding=require('text-encoding');

var self={
  _storage: require('./static-fs-data.json'),
  readFile: function(name,encoding){
    if (self._storage[name]!==undefined) {
      var encoding=encoding||self._storage[name].encoding;
      var buf=new Buffer(self._storage[name].data,self._storage[name].encoding);
      if (encoding=='binary') {
        if ('string'==typeof buf) {
          buf=new textEncoding.TextEncoder().encode(string);
        }
        return Promise.resolve(buf);
      } else {
        return Promise.resolve(buf.toString(encoding));
      }
    } else {
      return Promise.reject(new Error('File '+name+' not found !'));
    }
  }
}

module.exports=self;
