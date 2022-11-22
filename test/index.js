// @flow strict
const mrzScanner = require('../build/detect-and-parse.js');
const bufferFromUrl = require('../build/lib/bufferFromUrl');

const imgUrl = 'https://res.cloudinary.com/dlwgpokai/image/upload/v1668886022/h71rkpghcjhc4jpf49ko.jpg';

try {
  (async () => {
    const buffer = await bufferFromUrl(imgUrl);
    const result = await mrzScanner(buffer);
    console.log('result', result);
  })();
} catch (e) {
  console.error(e);
}
