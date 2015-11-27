module.exports = function (app) {
  app
    .config(['$routeProvider', '$locationProvider', '$compileProvider',
    function ($routeProvider, $locationProvider, $compileProvider) {
      //add chrome-extension protocol to angular's images whitelist regular expression
      var currentImgSrcSanitizationWhitelist = $compileProvider.imgSrcSanitizationWhitelist();
      var newImgSrcSanitizationWhiteList = currentImgSrcSanitizationWhitelist.toString().slice(0,-1)
        + '|chrome-extension:'
        +currentImgSrcSanitizationWhitelist.toString().slice(-1);

      $compileProvider.imgSrcSanitizationWhitelist(newImgSrcSanitizationWhiteList);

      $routeProvider
        .when('/:slug', {
          controller: 'gapminderToolsCtrl',
          reloadOnSearch: false
        })
        .otherwise({
          redirectTo: '/bubbles',
          reloadOnSearch: false
        });

      //Packaged apps aren't websites(it is not supported history API), so we have to use Hashbang mode(#)

      //$locationProvider.html5Mode({
      //  enabled: true,
      //  requireBase: false
      //});
    }]);
};
