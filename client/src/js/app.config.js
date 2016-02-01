module.exports = function (app) {
    app.run(function ($browser) {
      $browser.baseHref = function () {
        return "/tools/"
      };
    });

    app
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

      $routeProvider
        .when('/:slug', {
          controller: 'gapminderToolsCtrl',
          reloadOnSearch: false
        })
        .otherwise({
          redirectTo: '/bubbles',
          reloadOnSearch: false
        });

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
    }]);
};
