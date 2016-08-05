'use strict';

require('d3');

var Vizabi = require('vizabi');


// Start :: WSReader Integration

var WSReader = require('vizabi-ws-reader').WSReader;
var wsReader = new WSReader().getReader();
Vizabi.Reader.extend("waffle", wsReader);

// End :: WSReader Integration


// Setup WS location from webpack variable "WS_SERVER"
Vizabi._globals.ext_resources = {
  host: WS_SERVER + '/',
  preloadPath: 'api/vizabi/',
  dataPath: 'api/graphs/stats/vizabi-tools',
  //conceptpropsPath: WS_SERVER + '/api/vizabi/metadata.json'
  conceptpropsPath: WS_SERVER + '/api/vizabi/metadata.json',
  translationPath: WS_SERVER + '/api/vizabi/translation/en.json'
};

require('vizabi/build/dist/vizabi.css');
