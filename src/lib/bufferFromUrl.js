// @flow strict
const https = require('node:https');

module.exports = function bufferFromUrl(link: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https.get(link, (response) => {
      const chunks = [];
      response.on('data', (chunk) => {
        chunks.push(chunk);
      });
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
      response.on('error', (error) => {
        reject(error);
      });
    });
  });
};