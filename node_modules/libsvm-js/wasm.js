'use strict';

const loadSVM = require('./src/loadSVM');
const libsvm = require('./out/wasm/libsvm');

module.exports = libsvm.load().then(() => loadSVM(libsvm));
