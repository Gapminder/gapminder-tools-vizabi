'use strict';

module.exports = function (app) {
  app.run(function() {
    var locationPath = window.location.pathname || '';

    if (locationPath === '/' || locationPath.indexOf('/tools/') !== 0) {
      window.location.href = HOME_URL;
    }
  });

  app
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
      $routeProvider
        .when('/:slug', {
          controller: 'gapminderToolsCtrl',
          reloadOnSearch: false
        });

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    }]);
};
