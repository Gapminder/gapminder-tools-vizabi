require('d3');
var async = require('async');
var Vizabi = require('vizabi');
if (!!(typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getManifest)) {
  Vizabi._globals.gapminder_paths.baseUrl = chrome.runtime.getURL('');

  var xhr = new XMLHttpRequest();
  xhr.responseType = "json";
  async.parallel([
      function(callback) {
        //metadata
        var xhr = new XMLHttpRequest();
        xhr.responseType = "json";
        xhr.open('GET', chrome.runtime.getURL('data/waffles/metadata.json'), true);
        xhr.onreadystatechange = function () {
          if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            callback(null, xhr.response);
          } else if (xhr.readyState == XMLHttpRequest.DONE) {
            console.log('can\'t load metadata');
          }
        };
        xhr.send();
      },
      function(callback){
        //translation
        var xhr = new XMLHttpRequest();
        xhr.responseType = "json";
        xhr.open('GET', chrome.runtime.getURL('data/translation/en.json'), true);
        xhr.onreadystatechange = function () {
          if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            callback(null, xhr.response);
          } else if (xhr.readyState == XMLHttpRequest.DONE) {
            console.log('can\'t load metadata');
          }
        };
        xhr.send();
      }
    ],
    function(err, results){
      // the results array will equal ['one','two'] even though
      // the second function had a shorter timeout.
      if (err) {
        console.log('vizbi preload eror');
      }
      console.log('results');
      console.log(results);
      var metadata = results[0];
      var translation = results[1];

      Vizabi.Tool.define("preload", function(promise) {
        console.log('chrome preload start');

        Vizabi._globals.metadata = metadata;
        this.model.language.strings.set(this.model.language.id, translation);

        Vizabi._globals.metadata.indicatorsArray = ["gini", "gdp_per_cap", "u5mr"];

        promise = promise.resolve();
        return promise;
      });

    });



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

  //Vizabi._globals.gapminder_paths.baseUrl ="/work/projects/gapminder/src/gapminder-tools-vizabi/client/dist/tools/public/fixtures/";
  Vizabi._globals.gapminder_paths.baseUrl = path.join(electronPath, 'client/dist/tools/public/fixtures/');

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

