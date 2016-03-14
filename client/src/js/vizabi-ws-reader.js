require('d3');

var Vizabi = require('vizabi');
// Setup WS location from webpack variable "WS_SERVER"
Vizabi._globals.gapminder_paths.wsUrl = WS_SERVER;
require('vizabi/build/dist/vizabi.css');
