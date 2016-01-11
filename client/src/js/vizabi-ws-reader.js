require('d3');
var Vizabi = require('vizabi');
var prefix = location.pathname.indexOf('/tools') === 0 ? '/tools' : '';
Vizabi._globals.gapminder_paths.baseUrl = prefix + '/api/static/';
require('vizabi/build/dist/vizabi.css');
