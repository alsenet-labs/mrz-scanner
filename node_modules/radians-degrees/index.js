'use strict';
module.exports = function (radians) {
	if (typeof radians !== 'number') {
		throw new TypeError('Expected a number');
	}

	return radians * (180 / Math.PI);
};
