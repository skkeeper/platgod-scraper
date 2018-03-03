const expect = require('chai').expect;
const cheerio = require('cheerio');

const ItemElement = require('./ItemElement');

const mockItems = require('./mock_items');
const rebirthItem1 = mockItems.rebirthItem1;

describe('ItemElement for Rebirth Item', function () {
  const $ = cheerio.load(rebirthItem1);
  const item = new ItemElement($);

  it('has an ID', function () {
    expect(item.getItemID()).to.eql(1);
  });

  it('has a title', function () {
    expect(item.getTitle()).to.eql('The Sad Onion');
  });

  it('has pickup/lore text', function () {
    expect(item.getPickup()).to.eql('"Tears up"');
  });

  it('has item effects', function () {
    const effects = item.getEffects();
    expect(effects).to.be.an('array').to.deep.equal(['+0.7 Tears Up']);
  });

  it('has NO unlock condition', function () {
    expect(item.getUnlockCondition()).to.be.null;
  });

  it('is passive', function () {
    expect(item.getItemType()).to.eql('Passive');
  });

  it('part of the Item Room pool', function () {
    expect(item.getItemPool()).to.eql('Item Room');
  });

  it('has tags', function () {
    const tags = item.getTags();
    const expectedTags = ['item room', 'treasure room', 'item room pool', 'green', 'cry', 'plant'];
    expect(tags).to.deep.equal(expectedTags);
  });

  it('has css class', function () {
    expect(item.getCssClass()).to.eql('r-itm001');
  });

  // TODO: Write the toJSON test
});