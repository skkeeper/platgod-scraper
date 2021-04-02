const ItemElement = require('./ItemElement');

const TrinketElement = function (el) {
  this.element = el;
};

TrinketElement.prototype.getTrinketID = function () {
  return parseInt(this.element('.r-itemid').text().replace('TrinketID: ', '').trim());
};

TrinketElement.prototype.getTitle = ItemElement.prototype.getTitle;

TrinketElement.prototype.getPickup = ItemElement.prototype.getPickup;

TrinketElement.prototype.getEffects = ItemElement.prototype.getEffects;

TrinketElement.prototype.getUnlockCondition = ItemElement.prototype.getUnlockCondition;

TrinketElement.prototype.getTags = ItemElement.prototype.getTags;

TrinketElement.prototype.getTags = ItemElement.prototype.getTags;

TrinketElement.prototype.getUrl = ItemElement.prototype.getUrl;

TrinketElement.prototype.toJSON = function () {
  const json = {
    trinketID: this.getTrinketID(),
    title: this.getTitle(),
    pickup: this.getPickup(),
    effects: this.getEffects(),
    tags: this.getTags(),
    wikiUrl: this.getUrl(),
    _cssClass: this.getCssClass()
  };

  const unlock = this.getUnlockCondition();
  if (unlock !== null) {
    json['unlock'] = unlock;
  }

  return json;
};

module.exports = TrinketElement;