// @flow strict
'use strict';
const path = require('node:path');
const fs = require('node:fs/promises');
const Image = require('image-js').Image;

const extensions = ['.png', '.jpeg', '.jpg'];

async function writeImages(images: typeof Image | Array<typeof Image>) {
  if (!Array.isArray(images)) {
    images = [images];
  }

  // eslint-disable-next-line no-await-in-loop
  for (let entry of images) {
    
    const { image, filePath, ...metadata } = entry;

    if (!image || !filePath) {
      throw new Error('image and filePath props are mandatory');
    }

    const baseDir = path.resolve(path.dirname(filePath));
    await fs.mkdir(baseDir);
    const metadataPath = path.join(baseDir, path.basename(filePath).replace(path.extname(filePath), '.json'));

    await image.save(filePath);

    // eslint-disable-next-line no-undef
    const controller = new AbortController();
    const { signal } = controller;

    await fs.writeFile(metadataPath, metadata, { signal });
  }
}

async function readImages(dir: string): Promise<Array<Object>> {
  const images = [];
  const files = await fs.readdir(dir);
  // eslint-disable-next-line no-await-in-loop
  for (let file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);
    let metadata;
    if (stat.isFile()) {
      const ext = path.extname(filePath);
      if (!extensions.includes(ext.toLowerCase())) {
        continue;
      }
      const image = await Image.load(filePath);
      try {
        metadata = await fs.readFile(path.join(dir, file.replace(ext, '.json')));
      } catch (e) {
        metadata = {};
        // eslint-disable-next-line no-console
        console.log(`no metadata associated to ${filePath} found`);
      }
      metadata.filePath = filePath;
      images.push(
        Object.assign(metadata, {
          image,
          filePath
        })
      );
    } else {
      const dirImages = await readImages(filePath);
      for (let image of dirImages) {
        images.push(image);
      }
    }
  }
  return images;
}

module.exports = {
  readImages,
  writeImages
};
