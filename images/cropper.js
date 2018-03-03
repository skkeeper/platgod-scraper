'use strict';

const log = require('../log');
const Jimp = require('jimp');

module.exports = {
  /**
   * @typedef {Object} SubImage
   * @property {number} x
   * @property {number} y
   * @property {number} width
   * @property {number} height
   * @property {string} filename
   */

  /**
   *
   * @param {string} image
   * @param {SubImage[]} subImages
   * @param {string} outputDirectory
   */
  run: function (image, subImages, outputDirectory) {
    return new Promise((resolve, reject) => {
      Jimp.read(image, (err, handler) => {
        if (err) throw err;

        for(let i = 0; i < subImages.length; i++) {
          const clone = handler.clone();
          const dimension = subImages[i];

          clone.crop(
            handler.bitmap.width - dimension.x,
            dimension.y,
            dimension.width,
            dimension.height);

          log.child(dimension).debug('Cropping ' + dimension.filename);
          clone.resize(dimension.width, dimension.height).write(`${outputDirectory}/${dimension.filename}.png`);
        }

        resolve();
      });
    });
  }
};
