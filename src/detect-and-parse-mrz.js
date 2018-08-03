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
*/

'use strict';


const IJS = require('image-js').Image;


const { parse } = require('./mrz-relax');

module.exports = function(options) {
  const { getMrz, readMrz } = require('mrz-detection')({fs: options.fs});
  return async function detectAndParseMrz(image, result, progress) {
    result = result || {};

    if (progress) {
      console.time('detecting');
      progress('detecting');
    }
    result.detected = {};
    try {
      await getMrz(await IJS.load(image), {
        debug: true,
        out: result.detected
      });
    } catch (e) {
      result.error = e;
    }
    if (progress) console.timeEnd('detecting');
    if (result.error) return result;

    if (progress) {
      console.time('ocrizing');
      progress('ocrizing');
    }
    try {
      result.ocrized = await readMrz(await IJS.load(result.detected.crop.toDataURL()), {
        debug: true
      });
    } catch (e) {
      result.error = e;
    }
    if (progress) console.timeEnd('ocrizing');
    if (result.error) return result;

    if (progress) {
      console.time('parsing');
      progress('parsing');
    }
    try {
      result.parsed = parse(result.ocrized);
    } catch (e) {
      result.error = e;
    }
    if (progress) console.timeEnd('parsing');
    return result;
  }
};
