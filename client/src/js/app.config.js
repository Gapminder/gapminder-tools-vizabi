'use strict';

module.exports = function (app) {

  app
    // configuration
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

      $routeProvider
        .when('/tools/', {
          controller: 'gapminderToolsCtrl',
          reloadOnSearch: false
        })
        .otherwise(HOME_URL);

      $locationProvider.html5Mode(true);

    }])
    // launch
    .run();
};
