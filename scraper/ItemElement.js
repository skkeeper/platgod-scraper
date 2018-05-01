const ItemElement = function (el) {
  this.element = el;
};

function cleanString(str) {
  return str.replace(/ +(?= )/g, '').replace(/\n/g, ' ');
}

/**
 * @returns {number}
 */
ItemElement.prototype.getItemID = function () {
  const idString = this.element('.r-itemid').text().replace('ItemID: ', '').trim();
  return parseInt(idString, 10);
};

ItemElement.prototype.getTitle = function () {
  return this.element('.item-title').text();
};

ItemElement.prototype.getPickup = function () {
  return this.element('.pickup').text();
};

/**
 * @returns {string[]}
 */
ItemElement.prototype.getEffects = function () {
  return this.element('p').filter((_, p) => {
    return this.element(p).text().startsWith('•');
  }).map((_, p) => {
    return cleanString(this.element(p).text().replace('•', '').trim());
  }).toArray();
};

ItemElement.prototype.getUnlockCondition = function () {
  const unlockEl = this.element('.r-unlock');
  if (unlockEl.length === 0) {
    return null;
  }

  return unlockEl.text().replace('UNLOCK:', '').trim();
};

ItemElement.prototype.getItemType = function () {
  return this.element('ul>p').first().text().replace('Type: ', '');
};

ItemElement.prototype.getItemPool = function () {
  return this.element('ul>p').last().text().replace('Item Pool: ', '');
};

ItemElement.prototype.getTags = function () {
  return this.element('.tags').text().replace('*', '').trim().split(', ').filter((t) => {
    return t !== '';
  });
};

ItemElement.prototype.getCssClass = function () {
  const classes = this.element('a>div').attr('class').split(' ');
  return classes[classes.length - 1];
};

ItemElement.prototype.toJSON = function () {
  const json = {
    itemID: this.getItemID(),
    title: this.getTitle(),
    pickup: this.getPickup(),
    effects: this.getEffects(),
    itemType: this.getItemType(),
    itemPool: this.getItemPool(),
    tags: this.getTags(),
    _cssClass: this.getCssClass()
  };

  const unlock = this.getUnlockCondition();
  if (unlock !== null) {
    json['unlock'] = unlock;
  }

  return json;
};

module.exports = ItemElement;