'use strict';

module.exports = function (app) {
  app
    // configuration
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
      $routeProvider
        .when('/', {
          controller: 'gapminderToolsCtrl',
          reloadOnSearch: false
        });

      $locationProvider.html5Mode(true);
    }])
    // launch
    .run();
};
