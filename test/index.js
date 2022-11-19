// @flow strict
const mrzScanner = require('../build/detect-and-parse.js');
const bufferFromUrl = require('../build/lib/bufferFromUrl');

const imgUrl = 'https://res.cloudinary.com/dlwgpokai/image/upload/v1668886022/h71rkpghcjhc4jpf49ko.jpg';
console.log('imgUrl', imgUrl);

try {
  (async () => {
    const buffer = await bufferFromUrl(imgUrl);
    console.log('buffer', buffer);
    const fromUrl = await mrzScanner(imgUrl, (progress) => {
      console.log('progress', progress);
    });
    console.log('fromUrl', fromUrl);
    const fromBuffer = await mrzScanner(buffer);
    console.log('fromBuffer', fromBuffer);
  })();
} catch (e) {
  console.error(e);
}
