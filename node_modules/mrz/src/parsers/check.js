'use strict';

module.exports = function check(string, value) {
  let code = 0;
  let factors = [7, 3, 1];
  for (let i = 0; i < string.length; i++) {
    let charCode = string.charCodeAt(i);
    if (charCode === 60) charCode = 0;
    if (charCode >= 65) charCode -= 55;
    if (charCode >= 48) charCode -= 48;
    charCode *= factors[i % 3];
    code += charCode;
  }
  code %= 10;
  if (code !== Number(value)) {
    throw new Error(`invalid check digit: ${value}. Must be ${code}`);
  }
};
