exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',

  multiCapabilities: [{
    'browserName': 'phantomjs',
    'phantomjs.binary.path':'node_modules/phantomjs/bin/phantomjs'
  }, {
    'browserName': 'chrome'
  }, {
    'browserName': 'firefox'
  }],

  specs: ['spec.js']
};