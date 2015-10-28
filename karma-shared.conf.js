
module.exports = function() {
  return {
    basePath: '',
    frameworks: ['mocha'],
    reporters: ['progress'],
    browsers: ['Chrome'],
    autoWatch: true,
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-route/angular-route.js',
      'node_modules/angular-touch/angular-touch.js',
      //'tests/**/*Spec.js',
      './client/src/js/*.js'
    ],
    singleRun: false,
    plugins: [
      'karma-mocha',
      'karma-chrome-launcher',
      'karma-ng-scenario'
    ]
  }
};
