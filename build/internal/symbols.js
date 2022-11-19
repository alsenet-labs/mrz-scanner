//       strict
const MRZ                                            = { symbols: [], label: 'mrz' };

for (let i = '0'.charCodeAt(0); i <= '9'.charCodeAt(0); i++) {
  MRZ.symbols.push(i);
}
for (let i = 'A'.charCodeAt(0); i <= 'Z'.charCodeAt(0); i++) {
  MRZ.symbols.push(i);
}
MRZ.symbols.push('<'.charCodeAt(0));

module.exports = MRZ;