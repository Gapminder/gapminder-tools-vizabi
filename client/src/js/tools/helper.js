
var ToolHelper = function () {

  var bases = document.getElementsByTagName('base');
  var baseHref = '/';
  if (bases.length > 0) {
    baseHref = bases[0].href;
  }

  var emptyImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AIRDjYaNhWXvQAAAAxJREFUCNdj+P//PwAF/gL+3MxZ5wAAAABJRU5ErkJggg==";

  this.getBaseHref = function () {
    return baseHref;
  };

  this.getLoadingSuggestionItemData = function () {
    return {
      title: "Loading ...",
      subtitle: "",
      link: "",
      image: emptyImage
    };
  }

  return this;
};

module.exports = ToolHelper();
