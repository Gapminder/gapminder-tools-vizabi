// Karma configuration
var webpackConfig = require('./webpack.config.js');
module.exports = function(config) {
  config.set({

    basePath: '',
    frameworks: ['mocha'],
    files: [
      //'tests/**/*Spec.js'
      'tests/testSpec.js'
    ],
    preprocessors: {
      //'tests/**/*Spec.js': ['webpack']
      'tests/testSpec.js': ['webpack']
    },
    reporters: ['progress'],
    port: 9876,

    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['Chrome', 'PhantomJS'],

    webpack:webpackConfig,

    webpackMiddleware: {
      noInfo: true
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,
    plugins: [
      require('karma-webpack'),
      'karma-sauce-launcher',
      'karma-mocha',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher'
    ]
  })
};