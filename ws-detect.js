'use strict';

module.exports = function wsDetection(processEnv) {
  const DEFAULT_NODE_ENV = 'stage';
  const NODE_ENV = processEnv.NODE_ENV || DEFAULT_NODE_ENV;

  const DEFAULT_WS_HOST_URLS = {
    local: 'http://localhost',
    production: 'https://waffle-server.gapminderdev.org',
    stage: 'https://waffle-server-stage.gapminderdev.org',
    development: 'https://waffle-server-dev.gapminderdev.org'
  };

  const DEFAULT_WS_PORTS = {
    local: 3000,
    production: null,
    stage: null,
    development: null
  };

  const WShost = processEnv.WS_HOST || DEFAULT_WS_HOST_URLS[NODE_ENV];
  const WSport = processEnv.WS_PORT || DEFAULT_WS_PORTS[NODE_ENV];

  // Ready URL
  const WSurl = WShost + (WSport ? `:${WSport}` : '');

  return WSurl;
};
