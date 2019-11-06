# mrz-scanner

Detect, ocrize and parse (client or server side, or from command line) the Machine Readable Zone of passports and other documents

Using [mrz-detection](https://github.com/image-js/mrz-detection) written for NodeJS by [Daniel Kostro](https://github.com/stropitek) and [Michaël Zasso](https://github.com/targos).

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

## Web demo

The web demo is at https://alsenet-labs.github.io/mrz-scanner/dist/index.html (nothing is uploaded)

## Web demo from filesystem
The code is "same-origin friendly". That means it can be run in the browser from the filesystem (no web server required), with eg:

### Use the prebuilt static version
```
git clone https://github.com/alsenet-labs/mrz-scanner
xdg-open mrz-scanner/dist/index.html
```

### Rebuild and run the static version
```
git clone https://github.com/alsenet-labs/mrz-scanner
cd mrz-scanner
npm install
gulp dist
xdg-open dist/index.html
```

## Web demo from web server

You can build the scripts, start a web server and open a browser, with eg:
```
git clone https://github.com/alsenet-labs/mrz-scanner
cd mrz-scanner
npm start
```

## Command line tool
You can also scan documents from the command line using this repository or the latest published npm package.
On success the result will be stored in a file suffixed by ".mrz.json" along the original image by default.

### Using this repository
```
git clone https://github.com/alsenet-labs/mrz-scanner
cd mrz-scanner
npm install .
mrz2json [ -d|--dest-dir <directory> ] <png_or_jpg_or_tiff> [...]
```

### Using the latest published npm package

```
npm install -g mrz-scanner
mrz2json [ -d|--dest-dir <directory> ] <jpg_or_png_or_tiff> [...]
```

## Supported image formats

Supported image formats
The following formats can be loaded by image-js:

* PNG (8 or 16 bits, color or greyscale, with or without alpha)
* JPEG
* TIFF (8 or 16 bits, greyscale)
