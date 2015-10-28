var sharedConfig = require('./karma-shared.conf');

module.exports = function(config) {
  var conf = sharedConfig();

  conf.files = conf.files.concat([
    //test files
    './tests/e2e/**/*.js'
  ]);

  conf.proxies = {
    '/': 'http://localhost:8080'
  };

  conf.urlRoot = '/__karma__/';

  conf.frameworks = ['ng-scenario'];

  config.set(conf);
};
