
var DEFAULT_NODE_ENV = 'stage';
var NODE_ENV = process.env.NODE_ENV || DEFAULT_NODE_ENV;

var DEFAULT_WS_HOST_URLS = {
  local: 'http://localhost',
  production: 'https://waffle-server.gapminderdev.org',
  stage: 'https://waffle-server-stage.gapminderdev.org',
  development: 'https://waffle-server-dev.gapminderdev.org'
};

var DEFAULT_WS_PORTS = {
  local: 3000,
  production: null,
  stage: null,
  development: null
};

var WShost = process.env.WS_HOST || DEFAULT_WS_HOST_URLS[NODE_ENV];
var WSport = process.env.WS_PORT || DEFAULT_WS_PORTS[NODE_ENV];

var WSurl;

// Ready URL

WSurl = WShost + (WSport ? ':' + WSport : '');

module.exports = WSurl;
