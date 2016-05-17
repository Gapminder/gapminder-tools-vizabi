'use strict';

let Vizabi = null;
const signSeparator = '/';
const propertyExtResources = 'ext_resources';

require('d3');

Vizabi = require('vizabi');
// Setup WS location from webpack variable "WS_SERVER"
Vizabi._globals[propertyExtResources] = {
  host: WS_SERVER + signSeparator,
  preloadPath: 'api/vizabi/',
  dataPath: 'api/graphs/stats/vizabi-tools'
};

require('vizabi/build/dist/vizabi.css');
