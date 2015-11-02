require('d3');
var Vizabi = require('vizabi');
if (!!(typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getManifest)) {
  Vizabi._globals.gapminder_paths.baseUrl = 'http://localhost:3001/tools/api/static/';
} else {
  Vizabi._globals.gapminder_paths.baseUrl = '/tools/api/static/';
}


require('vizabi/build/dist/vizabi.css');

