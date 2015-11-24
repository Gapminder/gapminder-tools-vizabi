require('d3');
var async = require('async');
var Vizabi = require('vizabi');
if (!!(typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getManifest)) {
  Vizabi._globals.gapminder_paths.baseUrl = chrome.runtime.getURL('');
} else {
  Vizabi._globals.gapminder_paths.baseUrl = '/tools/api/static/';
}



require('vizabi/build/dist/vizabi.css');

