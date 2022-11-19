'use strict';

const loadSVM = require('./src/loadSVM');
const libsvm = require('./out/asm/libsvm');

module.exports = loadSVM(libsvm);
