const Xray = require('x-ray');
const x = Xray();

const cheerio = require('cheerio');

const http = require('http');
const css = require('css');

const ItemElement = require('./ItemElement');
const TrinketElement = require('./TrinketElement');
const ConsumableElement = require('./ConsumableElement');

const Downloader = require('../images/downloader');
const ImageCropper = require('../images/cropper');

const baseUrl = 'http://platinumgod.co.uk/';

const cssFile = `${baseUrl}/assets/main.css`;

const itemImages = {
  'r-itm': 'rebirth-items.png',
  'a-itm': 'ab-items6.png',
  'ap-itm': 'ap-items9.png',
  'r-junxx': 'rebirth-trinket-final.png',
  'a-junxx': 'ab-trinkets4.png',
  'ap-junxx': 'ap-trinkets8.png',
  'r-card': 'ap-cards1.png'
};

module.exports = {
  _scrapeItemClass: function (scope) {
    return new Promise(function (resolve, reject) {
      x(baseUrl, scope, ['li.textbox@html'])((err, results) => {
        const items = [];
        for (let i = 0; i < results.length; i++) {
          items.push(new ItemElement(cheerio.load(results[i])).toJSON());
        }
        resolve(items);
      });
    });
  },

  _scrapeTrinketClass: function (scope) {
    return new Promise(function (resolve, reject) {
      x(baseUrl, scope, ['li.textbox@html'])((err, results) => {
        const items = [];
        for (let i = 0; i < results.length; i++) {
          items.push(new TrinketElement(cheerio.load(results[i])).toJSON());
        }
        resolve(items);
      });
    });
  },

  _scrapeConsumableClass: function (scope) {
    return new Promise(function (resolve, reject) {
      x(baseUrl, scope, ['li.textbox@html'])((err, results) => {
        const items = [];
        for (let i = 0; i < results.length; i++) {
          const consumable = new ConsumableElement(cheerio.load(results[i]));

          const pillSuffix = ' (pill)';
          if (consumable.isPillList()) {
            const effects = consumable.getEffects();
            for (let j = 0; j < effects.length; j++) {
              const effect = effects[j];

              let pillName = `${effect.split(' - ')[0]}${pillSuffix}`;

              items.push({
                title: pillName,
                effects: [
                  effect.split(' - ')[1]
                ]
              });
            }
          } else {
            items.push(consumable.toJSON());
          }
        }

        resolve(items);
      });
    });
  },

  _scrapeConsumables: function () {
    return this._scrapeConsumableClass('.tarot-container');
  },

  getAllItems: function() {
    return new Promise((resolve, reject) => {
      let allItems = [];
      this._scrapeItemClass('.items-container').then((items) => {
        allItems = allItems.concat(items.map((i) => {i.category = 'REBIRTH_ITEM'; return i;}));
        return this._scrapeItemClass('.afterbirthitems-container');
      }).then((items) => {
        allItems = allItems.concat(items.map((i) => {i.category = 'AFTERBIRTH_ITEM'; return i;}));
        return this._scrapeItemClass('.afterbirthplusitems-container');
      }).then((items) => {
        allItems = allItems.concat(items.map((i) => {i.category = 'AFTERBIRTHPLUS_ITEM'; return i;}));
        return this._scrapeItemClass('.boosteritems-container');
      }).then((items) => {
        allItems = allItems.concat(items.map((i) => {i.category = 'BOOSTER_ITEM'; return i;}));
        return this._scrapeItemClass('.main > *:nth-child(3)');
      }).then((items) => {
        allItems = allItems.concat(items.map((i) => {i.category = 'REPENTANCE_ITEM'; return i;}));
        return this._scrapeTrinketClass('.trinkets-container');
      }).then((items) => {
        allItems = allItems.concat(items.map((i) => {i.category = 'REBIRTH_TRINKET'; return i;}));
        return this._scrapeTrinketClass('.afterbirthtrinkets-container');
      }).then((items) => {
        allItems = allItems.concat(items.map((i) => {i.category = 'AFTERBIRTH_TRINKET'; return i;}));
        return this._scrapeTrinketClass('.afterbirthplustrinkets-container');
      }).then((items) => {
        allItems = allItems.concat(items.map((i) => {i.category = 'AFTERBIRTHPLUS_TRINKET'; return i;}));
        return this._scrapeTrinketClass('.boostertrinkets-container');
      }).then((items) => {
        allItems = allItems.concat(items.map((i) => {i.category = 'BOOSTER_TRINKET'; return i;}));
        return this._scrapeTrinketClass('.main > *:nth-child(4)');
      }).then((items) => {
        allItems = allItems.concat(items.map((i) => {i.category = 'REPENTANCE_TRINKET'; return i;}));
        return this._scrapeConsumables();
      }).then((items) => {
        resolve(allItems.concat(items.map((i) => {i.category = 'CONSUMABLES'; return i;})));
      });
    });
  },

  _downloadTextFile: function () {
    return new Promise((resolve, reject) => {
      http.get(cssFile, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          resolve(data);
        });

      }).on("error", (err) => {
        reject(err);
      });
    });
  },

  _parseCss: function(text) {
    return css.parse(text, {});
  },

  /**
   * @param css
   * @param {string} cssClass
   * @returns {SubImage}
   * @private
   */
  _getSubImage: function (css, cssClass) {
    let results = css.stylesheet.rules.filter((r) => {
      if (r.selectors) {
        let selResults = r.selectors.filter((s) => {return s.indexOf(cssClass) !== -1});
        return selResults.length > 0;
      }
      return false;
    });

    //console.log('cssClass: ' + cssClass);
    //console.log(results[0]);

    const widthProperty = results[0].declarations.filter((d) => {return d.property === 'width'});
    const width = widthProperty.length === 1 ? parseInt(widthProperty[0].value.replace('px', '')) : 50;

    const heightProperty = results[0].declarations.filter((d) => {return d.property === 'height'});
    const height = heightProperty.length === 1 ? parseInt(heightProperty[0].value.replace('px', '')) : 50;

    const positionString = results[0].declarations.filter((d) => {return d.property === 'background-position'})[0].value;

    return {
      x: parseInt(positionString.split(' ')[0]),
      y: parseInt(positionString.split(' ')[1]),
      width: width,
      height: height,
      filename: cssClass
    };
  },

  _getRefImageUrl: (imageName) => {
    return `${baseUrl}images/${imageName}`;
  },

  _getRefImages: function () {
    const downloads = [];
    const keys = Object.keys(itemImages);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      downloads.push(Downloader.get(this._getRefImageUrl(itemImages[key])));
    }
    return Promise.all(downloads);
  },

  /**
   *
   * @param {string[]}cssClassList
   * @param {string} outputDirectory
   */
  getAllImages: function (cssClassList, outputDirectory) {
    return this._getRefImages().then((refImages) => {
      return this._downloadTextFile(cssFile).then((cssText) => {
        return [cssText, refImages]
      });
    }).then(([cssText, refImages]) => {
      const css = this._parseCss(cssText);
      const subImages = [];

      for (let i = 0, length = cssClassList.length; i < length; i++) {
        const cssClass = cssClassList[i];

        if (cssClass === undefined) continue;

        subImages.push(this._getSubImage(css, cssClass));
      }

      const cropperPromises = [];
      for (let i = 0; i < Object.keys(itemImages).length; i++) {
        let key = Object.keys(itemImages)[i];
        let classedImages = subImages.filter((si) => {return si.filename.startsWith(key)});

        if (classedImages.length === 0) {
          continue;
        }

        cropperPromises.push(ImageCropper.run(refImages[i], classedImages, outputDirectory));
      }

      return Promise.all(cropperPromises);
    });
  }
};