module.exports = function (app) {
  var config = {
    isChromeApp: IS_CHROME_APP,
    //todo: use $location.host ?
    apiUrl: this.isChromeApp ? 'http://localhost:3001/tools/api' : 'http://localhost:8080/tools/api'
  };
  app
    .constant('config', config)
    .config(['$routeProvider', '$locationProvider', '$compileProvider', 'config',
    function ($routeProvider, $locationProvider, $compileProvider, config) {
      //add chrome-extension protocol to angular's images whitelist regular expression
      if (config.isChromeApp) {
        var currentImgSrcSanitizationWhitelist = $compileProvider.imgSrcSanitizationWhitelist();
        var newImgSrcSanitizationWhiteList = currentImgSrcSanitizationWhitelist.toString().slice(0,-1)
          + '|chrome-extension:'
          +currentImgSrcSanitizationWhitelist.toString().slice(-1);

        $compileProvider.imgSrcSanitizationWhitelist(newImgSrcSanitizationWhiteList);
      }

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
      if (!config.isChromeApp) {
        $locationProvider.html5Mode({
          enabled: true,
          requireBase: false
        });
      }
    }])

};
