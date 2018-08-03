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
const fs = require('../static-fs.js');
var _readFile=fs.readFile;
fs.readFile=function(url,encoding){
  var dirname ='/node_modules/mrz-detection';
  url = url.replace(dirname, '');
  return _readFile(url,encoding);
}
var detectAndParseMrz = require('./detect-and-parse-mrz.js')({fs: fs});
var extend = require('extend');

self.config = {
  fsRootUrl: location.origin
}
var result = {};

self.addEventListener('message', function (e) {
  var data = e.data;

  switch (data.cmd) {
    case 'config':
      extend(self.config,data.config);
      break;

    case 'process':
      try {
        result = {};
        detectAndParseMrz(data.image, result, function progress(msg) {
          self.postMessage({
            type: 'progress',
            msg: msg
          });
        })
          .then(function (result) {
            if (result.error) {
              console.log(result.error);
            }
            var message = {
              type: 'result',
              result: {
                error: result.error && result.error.message,
                ocrized: result.ocrized,
                parsed: result.parsed,
                images: result.detected && Object.keys(result.detected)
              }
            };
            self.postMessage(message);
          })
          .catch(function (err) {
            console.log(err);
            self.postMessage({
              type: 'error',
              error: err.message
            });
          });
      } catch (err) {
        console.log(err);
        self.postMessage({ type: 'error', error: err.message });
      }
      break;

    case 'stop':
      self.close();
      break;

    case 'get-image':
      if (!result.detected || !result.detected[data.image] || !result.detected[data.image].getRGBAData) {
        self.postMessage({ type: 'error', error: `no such image: ${data.image}` });
      } else {
        var image = result.detected[data.image];
        var rgba = image.getRGBAData({ clamped: true }, image.width, image.height);
        self.postMessage({
          rgba: rgba,
          type: 'image',
          name: data.image,
          height: image.height,
          width: image.width,
          random: data.random
        }, [rgba.buffer]);
      }
      break;

    default:
      console.log('unhandled event', e);
      break;
  }
}, false);


