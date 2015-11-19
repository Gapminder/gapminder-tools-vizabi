require('d3');
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
  var remote = require('remote');
  var app = remote.require('app');
  var electronPath = app.getAppPath();
  
  Vizabi._globals.gapminder_paths.baseUrl ="/work/projects/gapminder/src/gapminder-tools-vizabi/client/dist/tools/public/fixtures/";

  Vizabi.Tool.define("preload", function(promise) {
    console.log('preload start');
    Vizabi._globals.metadata =
      JSON.parse(fs.readFileSync(path.join(electronPath, 'client/dist/tools/public/fixtures/waffles/metadata.json'), 'utf8'));
    //@todo: read en.json from dist
    var languageData = JSON.parse(fs.readFileSync(path.join(electronPath, 'client/src/public/fixtures/translation/en.json'), 'utf8'));
    this.model.language.strings.set(this.model.language.id, languageData);

    Vizabi._globals.metadata.indicatorsArray = ["gini", "gdp_per_cap", "u5mr"];

    promise = promise.resolve();
    console.log('preload end');
    return promise;
  });
}

require('vizabi/build/dist/vizabi.css');

