'use strict';

module.exports = function (processEnv) {
  var DEFAULT_NODE_ENV = 'stage';
  var NODE_ENV = processEnv.NODE_ENV || DEFAULT_NODE_ENV;

  var DEFAULT_WS_HOST_URLS = {
    local: 'http://localhost',
    production: 'https://waffle-server.gapminder.org',
    stage: 'https://waffle-server-poc.gapminder.org',
    development: 'https://waffle-server-dev.gapminderdev.org'
  };

  var DEFAULT_WS_PORTS = {
    local: 3000,
    production: null,
    stage: null,
    development: null
  };

  var WShost = processEnv.WS_HOST || DEFAULT_WS_HOST_URLS[NODE_ENV];
  var WSport = processEnv.WS_PORT || DEFAULT_WS_PORTS[NODE_ENV];

  // Ready URL
  var WSurl = WShost + (WSport ? ':' + WSport : '');

  return WSurl;
};
