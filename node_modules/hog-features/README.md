# HOG features (Histogram of oriented gradients)

  [![build status][travis-image]][travis-url]
  [![npm download][download-image]][download-url]

## Principe

The main feature of this repository will compute the [HOG features](https://en.wikipedia.org/wiki/Histogram_of_oriented_gradients) of an image. The HOG features (called HOG descriptor too) are useful for image recognition and image detection. You can find a good tutorial about HOG features [here](http://mccormickml.com/2013/05/09/hog-person-detector-tutorial/).

## Installation

```sh
npm install hog-features -S
```

## Usage

### extractHOG(image[, options])

Generate a vector which corresponds to the HOG descriptor of an image.
Returns an array of float.

__arguments__

* `image` - an Image
* `options` - an optional object

__options__

* `cellSize`: length of cell in px (default: 4).
* `blockSize`: length of block in number of cells (default: 2).
* `blockStride`: number of cells to slide block window by (default: block-size / 2).
* `bins`: bins per histogram (default: 6).
* `norm`: norm block normalization method (default: "L2". Other possibilities : "L1" and "L1-sqrt").

## Example

```js
'use strict';

const {Image} = require('image-js');
const hog = require('hog-features');

const file = __dirname + '/__test__/beachball.png';

Image.load(file).then(function (image) {
    var descriptor = hog.extractHOG(image);
    console.log(descriptor);
});
```

## Tutorial

You can find a tutorial where the HOG features is used with an SVM classifier to classify road signs. [Here is the tutorial](https://github.com/jajoe/tutorial-nodejs/tree/master/image-classification).

## License

[MIT](./LICENSE)

Inspired by [harthur implementation](https://github.com/harthur/hog-descriptor)

[travis-image]: https://img.shields.io/travis/image-js/hog/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/image-js/hog
[download-image]: https://img.shields.io/npm/dm/hog-features.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/hog-features
