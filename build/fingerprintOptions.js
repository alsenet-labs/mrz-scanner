const path = require('path');
const symbols = require('./internal/symbols');

module.exports = {
  baseDir: path.join(__dirname, './fontData'),
  height: 12,
  width: 12,
  minSimilarity: 0.5,
  fontName: 'ocrb',
  category: symbols.label,
  ambiguity: true
};
