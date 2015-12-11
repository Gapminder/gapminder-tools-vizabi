var path = require('path');

var config = {
  PORT: 3001,
  HOST: 'http://localhost',
  EXTERNAL_PORT:   process.env.PORT || 3000,
  EXTERNAL_HOST: process.env.HOST || 'http://localhost'
};

module.exports = config;
