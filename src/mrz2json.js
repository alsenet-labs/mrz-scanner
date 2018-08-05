#!/usr/bin/env node
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

var fs=require('fs-extra');
var path=require('path');
var detectAndParseMrz=require('./detect-and-parse-mrz.js')({fs: fs});
var exitCode=0
var Q=require('q');

var program=require('commander');

program.version('1.2.0')
.usage('[options] <file...>')
.option('-d, --dest-dir <path>')

program.parse(process.argv);

if (program.args.length<1) {
  program.outputHelp();
  process.exit(1);
}

program.args.reduce(function(promise,filename){
  return promise.then(function(){
    console.error('\nProcessing',filename);
    var outFile;
    if(program.destDir) {
      outFile=path.join(program.destDir,path.basename(filename))+'.mrz.json';
    } else {
      outFile=filename+'.mrz.json';
    }
    console.time(outFile);
    return detectAndParseMrz(filename)
    .then(function(result){
      if (result.parsed) {
        if (!result.parsed.valid) {
          console.error(JSON.stringify(result.parsed.modified || result.parsed,false,4));
          throw new Error('Parse error');
        }
        if (result.parsed.modified) {
          result.parsed.modified._fixed=true;
        }
        fs.writeFileSync(outFile,JSON.stringify((result.parsed.modified && result.parsed.modified.fields) || result.parsed.fields,false,4)+'\n');
        console.timeEnd(outFile);
      } else {
        if (result.ocrized) {
          console.error(result.ocrized);
        }
        if (result.error && result.error.message) {
          throw new Error(result.error.message);
        } else {
          throw new Error('Failed !');
        }
      }
    })
    .catch(function(err){
      if (process.env.DEBUG) console.error(JSON.stringify(err,false,4));
      else console.error('*** Error:',err.message);
      exitCode=1;
    })
  });
},Q.resolve())
.catch(function(err){
  if (process.env.DEBUG) console.error(JSON.stringify(err,false,4));
  else console.error(err.message);
  exitCode=1;
})
.finally(function(){
  console.error('\n');
  process.exit(exitCode);
});
