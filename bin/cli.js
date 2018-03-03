#! /usr/bin/env node

// ====================================================================================================================
// "When you start milking poop for red hearts, you have to ask yourself: what separates us from the beasts?"
// ====================================================================================================================

const fs = require('fs');

const log = require('../log');

const pgScraper = require('../scraper/platinum_god');

const args = process.argv.slice(2);

const saveJson = !args.includes('--skip-items');
const saveImages = !args.includes('--skip-images');

if (!saveJson && !saveImages) {
  return;
}

pgScraper.getAllItems().then((items) => {
  if (saveJson) {
    fs.writeFile('items.json', JSON.stringify({items: items}, null, 2), 'utf8', () => {
      log.info('items.json saved.')
    });
  }

  return items;
}).then((items) => {
  if (saveImages) {
    pgScraper.getAllImages(items.map((item) => {return item._cssClass}), 'imgs').then(() => {
      log.info('images downloaded.');
    });
  }
});