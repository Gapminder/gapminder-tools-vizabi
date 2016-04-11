'use strict';

// An example configuration file.
var config = {
  baseUrl: 'http://localhost:3001/',

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['../tests/e2e/*.js'],
  exclude: [],

  // Framework to use. Jasmine is recommended.
  framework: 'jasmine',

  // Options to be passed to Jasmine.
  allScriptsTimeout: 110000,

  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 400000,
    print: function () {
    }
  },

  onPrepare: function () {
    browser.ignoreSynchronization = true;
    var SpecReporter = require('jasmine-spec-reporter');
    // add jasmine spec reporter
    jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all'}));
  },

  reporter: ['spec'],

  /**
   * Angular 2 configuration
   *
   * useAllAngular2AppRoots: tells Protractor to wait for any angular2 apps on the page instead of just the one matching
   * `rootEl`
   *
   */
  useAllAngular2AppRoots: true,

  // Capabilities to be passed to the webdriver instance.
  capabilities :  {
    'browserName': 'chrome',
    chromeOptions: {
      args: ['show-fps-counter=true']
    }
  }
};
config.seleniumAddress = 'http://127.0.0.1:4444/wd/hub';

exports.config = config;
