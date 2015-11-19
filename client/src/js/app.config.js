module.exports = function (app) {
  var isElectronApp = (typeof _isElectronApp !== 'undefined' && _isElectronApp === true);
  var isChromeApp = !!(typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getManifest);
  var config = {
    isChromeApp: true,
    isElectronApp: isElectronApp,
    apiUrl: (isChromeApp || isElectronApp) ? 'http://localhost:3001/tools/api' : 'http://localhost:8080/tools/api'
  };

  if (isElectronApp) {
    var remote = require('remote');
    var electronApp = remote.require('app');
    config.electronPath = electronApp.getAppPath()
  }

  app
    .constant('config', config)
    .config(['$routeProvider', '$locationProvider', '$compileProvider', 'config',
    function ($routeProvider, $locationProvider, $compileProvider, config) {
      //add chrome-extension protocol to angular's images whitelist regular expression
      if (config.isChromeApp || config.isElectronApp) {
        var currentImgSrcSanitizationWhitelist = $compileProvider.imgSrcSanitizationWhitelist();
        var newImgSrcSanitizationWhiteList = currentImgSrcSanitizationWhitelist.toString().slice(0,-1)
          + '|chrome-extension:'
          + '|file:'
          +currentImgSrcSanitizationWhitelist.toString().slice(-1);

        $compileProvider.imgSrcSanitizationWhitelist(newImgSrcSanitizationWhiteList);
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
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
      if (!config.isChromeApp && !config.isElectronApp) {
        $locationProvider.html5Mode({
          enabled: true,
          requireBase: false
        });
      }
    }])

};
