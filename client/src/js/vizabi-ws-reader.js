require('d3');

var Vizabi = require('vizabi');
// Setup WS location from webpack variable "WS_SERVER"
Vizabi._globals.ext_resources = {
  host: WS_SERVER + "/",
  preloadPath: 'api/vizabi/',
  dataPath: 'api/graphs/stats/vizabi-tools'
};      

require('vizabi/build/dist/vizabi.css');
