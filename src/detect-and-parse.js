// @flow strict
const ImageClass = require('image-js').Image;
const getMrz = require('./getMrz');
const mrzOcr = require('./internal/mrzOcr');

const parse = require('./mrz-relax');

module.exports = async function detectAndParseMrz(image: typeof ImageClass) {
  try {
    const mrz = await getMrz(await ImageClass.load(image));
    
    const imageDataUrl = mrz.toDataURL();

    const toImage = await ImageClass.load(imageDataUrl);

    var { ocrResult, mask, rois } = await mrzOcr(toImage);

    const parsed = parse(ocrResult);

    return parsed;
  } catch (e) {
    console.log(e);
  }
  
};
