# mrz-scanner

Detect, ocrize and parse MRZ from documents server side.

Using [mrz-detection](https://github.com/image-js/mrz-detection) written for NodeJS by [Daniel Kostro](https://github.com/stropitek) and [Michaël Zasso](https://github.com/targos).

Based on [mrz-scanner](https://github.com/alsenet-labs/mrz-scanner)

# LICENSE
```
Copyright (c) 2018-2019 ALSENET SA

Author(s):

      Luc Deschenaux <luc.deschenaux@freesurf.ch>

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

```
# Quickstart

```
yarn add mrz-scan
      OR
npm i mrz-scan
```

```js
const mrzScanner = require('mrz-scan');
const imgUrl = 'https://res.cloudinary.com/dlwgpokai/image/upload/v1668886022/h71rkpghcjhc4jpf49ko.jpg';

const result = await mrzScanner(imgUrl);
console.log('result: ', result)
```
```
result: {
  number: 'A3536444',
  validDate: '2031-03-10',
  birthDate: '2012-12-12',
  name: 'THURIDUROESPZ',
  surname: 'AEVARSDOTTIR'
}
```
## Supported image formats

Supported image formats
The following formats can be loaded by image-js:

* PNG (8 or 16 bits, color or greyscale, with or without alpha)
* JPEG
* TIFF (8 or 16 bits, greyscale)
