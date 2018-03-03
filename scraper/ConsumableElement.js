const ItemElement = require('./ItemElement');

const pillListNames = [
  'Rebirth Pills A - L (Page 1 of 2)',
  'Rebirth Pills P - Z (Page 2 of 2)',
  'Afterbirth Pills',
  'Afterbirth+ Pills'
];

const ConsumableElement = function (el) {
  this.element = el;
};

ConsumableElement.prototype.getConsumableID = function () {
  const classes = this.element('a>div').attr('class').split(' ').filter((name) => {return name.includes('r-card')});
  return parseInt(classes[0].replace('r-card', ''));
};

ConsumableElement.prototype.getTitle = ItemElement.prototype.getTitle;

ConsumableElement.prototype.getPickup = ItemElement.prototype.getPickup;

ConsumableElement.prototype.getEffects = ItemElement.prototype.getEffects;

ConsumableElement.prototype.getUnlockCondition = ItemElement.prototype.getUnlockCondition;

ConsumableElement.prototype.getTags = ItemElement.prototype.getTags;

ConsumableElement.prototype.getCssClass = ItemElement.prototype.getCssClass;

ConsumableElement.prototype.isPillList = function () {
  return pillListNames.includes(this.getTitle());
};

ConsumableElement.prototype.toJSON = function () {
  const json = {
    consumableID: this.getConsumableID(),
    title: this.getTitle(),
    pickup: this.getPickup(),
    effects: this.getEffects(),
    tags: this.getTags(),
    _cssClass: this.getCssClass()
  };

  const unlock = this.getUnlockCondition();
  if (unlock !== null) {
    json['unlock'] = unlock;
  }

  return json;
};

module.exports = ConsumableElement;