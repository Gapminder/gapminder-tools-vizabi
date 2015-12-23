var path = require('path');

var config = {
  PORT: 3001,
  HOST: 'http://localhost',
  WS_PORT: process.env.WS_PORT || 3000,
  WS_HOST: process.env.WS_HOST || 'http://localhost'
};

module.exports = config;
