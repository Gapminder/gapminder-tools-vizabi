
var ToolHelper = function () {

  var bases = document.getElementsByTagName('base');
  var baseHref = '/';
  if (bases.length > 0) {
    baseHref = bases[0].href;
  }

  this.getBaseHref = function () {
    return baseHref;
  };

  return this;
};

module.exports = ToolHelper();
