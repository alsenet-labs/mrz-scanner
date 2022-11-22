// @flow strict
const mrzScanner = require('../build/detect-and-parse.js');
const imgUrl = 'https://res.cloudinary.com/dlwgpokai/image/upload/v1668886022/h71rkpghcjhc4jpf49ko.jpg';

try {
  (async () => {
    const result = await mrzScanner(imgUrl);
    console.log('result', result);
  })();
} catch (e) {
  console.error(e);
}
