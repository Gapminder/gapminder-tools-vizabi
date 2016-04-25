'use strict';

module.exports = function appConfig(app) {
  app.run(() => {
    const locationPath = window.location.pathname || '';

    if (locationPath === '/' || locationPath.indexOf('/tools/') !== 0) {
      window.location.href = HOME_URL;
    }
  });

  app
    .config(['$routeProvider', '$locationProvider', function config($routeProvider, $locationProvider) {
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
