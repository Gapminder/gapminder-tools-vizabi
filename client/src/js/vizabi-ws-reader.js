require('d3');
var graphData;
var Vizabi = require('vizabi');
if (!!(typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getManifest)) {
  Vizabi._globals.gapminder_paths.baseUrl = 'http://localhost:3001/tools/api/static/';
} else {
  Vizabi._globals.gapminder_paths.baseUrl = '/tools/api/static/';
}

if (typeof _isElectronApp !== 'undefined' && _isElectronApp) {
  console.log('is electron app');
  var fs = require('fs');
  var path = require('path');

  Vizabi.Tool.define("preload", function(promise) {
    Vizabi._globals.metadata =
      JSON.parse(fs.readFileSync(path.join('client/dist/tools/public/fixtures/waffles/metadata.json'), 'utf8'));
    //@todo: read en.json from dist
    var languageData = JSON.parse(fs.readFileSync(path.join('client/src/public/fixtures/translation/en.json'), 'utf8'));
    this.model.language.strings.set(this.model.language.id, languageData);

    Vizabi._globals.metadata.indicatorsArray = ["gini", "gdp_per_cap", "u5mr"];

    promise = promise.resolve();
    return promise;
  });
}

require('vizabi/build/dist/vizabi.css');

