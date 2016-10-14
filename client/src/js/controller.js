'use strict';

var Urlon = require('URLON');
var Vizabi = require('vizabi');
var FlashDetect = require('./flash-detect');
var _ = require('lodash');

var BITLY_SHORTENER_URL = 'https://api-ssl.bitly.com/v3/shorten';

module.exports = function (app) {
  app
    .controller('gapminderToolsCtrl', [
      '$scope', '$route', '$routeParams', '$location', 'vizabiItems', 'vizabiFactory', '$window',
      function ($scope, $route, $routeParams, $location, vizabiItems, vizabiFactory, $window) {
        // definition
        $scope.loadingError = false;
        $scope.tools = {};
        $scope.validTools = [];
        $scope.relatedItems = [];

        var tempHash = '';
        var currHash = '';
        var modelWasChanged = false;
        var historyLength = 0;

        var locationPath = $location.path() || '';
        var locationHash = $location.hash() || '';
        var REQUIRED_PARAM = 'chart-type';
        var REQUIRED_PATH = '/tools';

        var deprecatedQueryPaths = ['bubbles', 'mountain', 'map'];
        var deprecatedQueryPathParts = locationPath.split('/');
        var deprecatedQueryDetected = deprecatedQueryPathParts.length >= 3 &&
          deprecatedQueryPaths.indexOf(deprecatedQueryPathParts[2]) !== -1;
        var shouldNavigateToHome =
          locationPath.indexOf(REQUIRED_PATH) === -1 || locationHash.indexOf(REQUIRED_PARAM) === -1;

        if (deprecatedQueryDetected) {
          var deprecatedQueryChart = deprecatedQueryPathParts[2];

          var hashEncoded = encodeURI(decodeURIComponent(locationHash));

          var urlModel = hashEncoded ? Urlon.parse(hashEncoded) : {};
          urlModel['chart-type'] = deprecatedQueryChart;

          var deprecatedQueryRedirect = REQUIRED_PATH + '/#' + Urlon.stringify(urlModel);
          $location.url(deprecatedQueryRedirect);
        }

        if (shouldNavigateToHome && !deprecatedQueryDetected) {
          // invalid URL, redirect to Home
          $location.url(HOME_URL);
        }

        // preload items
        vizabiItems.getItems().then(function (items) {
          $scope.tools = items;
          $scope.validTools = Object.keys($scope.tools);

          // detect chart type
          $scope.chartType = getChartType(replaceWordBySymbol($location.url()));

          // load vizabi chart if type is Ok
          if (isChartTypeValid($scope.chartType)) {
            updateGraph();
          } else {
            // invalid URL, redirect to Home
            $location.url(HOME_URL);
          }
        });

        // setup scope and handlers
        controllerImplementation();

        $scope.$root.$on('onModelChanged', function (e, data) {
          currHash = data.hash;

          tempHash = currHash;

          window.location.hash = replaceSymbolByWord(currHash);
        });

        function replaceSymbolByWord(inputString) {
          return inputString.replace(/\//g, '_slash_').replace(/%2F/g, '_slash_');
        }

        function replaceWordBySymbol(inputString) {
          return inputString.replace(/_slash_/g, '/').replace(/%2F/g, '/');
        }

        function getHash(url) {
          var loc = url;
          var hash = null;

          if (loc.indexOf('#') >= 0) {
            hash = loc.substring(loc.indexOf('#') + 1);
          }

          return encodeURI(decodeURIComponent(replaceWordBySymbol(hash)));
        }

        // change hash handler
        $scope.$root.$on('$locationChangeSuccess', function (event, urlCurrent, urlPrevious) {
          currHash = getHash(urlCurrent);

          if (modelWasChanged === true && historyLength < window.history.length) {
            modelWasChanged = false;
          } else {
            if (currHash !== tempHash) {
              updateGraph();

              modelWasChanged = true;
            }

            historyLength = window.history.length;
          }

          historyLength = window.history.length;

          tryToUpdateGraphic(urlCurrent, urlPrevious);
        });

        function tryToUpdateGraphic(urlCurrent, urlPrevious) {
          var urlPreviousVar = replaceWordBySymbol(urlPrevious);
          var urlCurrentVar = replaceWordBySymbol(urlCurrent);

          var chartTypePrevious = getChartType(urlPreviousVar);
          var chartTypeCurrent = getChartType(urlCurrentVar);

          // invalid URL, redirect to Home
          if (!isChartTypeValid(chartTypeCurrent)) {
            if (isChartTypesLoaded()) {
              $location.url(HOME_URL);
            }
            return;
          }

          $scope.chartType = chartTypeCurrent;

          // reload chart if type was changed
          if (chartTypePrevious !== chartTypeCurrent) {
            updateGraph();
          }
        }

        // business logic
        function controllerImplementation() {
          $scope.embedVizabi = $location.search().embedded === 'true';

          $scope.embedded = function () {
            $location.search('embedded', 'true');
            prompt('Copy link', $location.absUrl());
            $location.search('embedded', null);
          };

          setUpSocialLinkHandlers();

          // BITLY
          $scope.shareLink = function () {
            var params = makeParamsForUrlShortening();

            getJSON(BITLY_SHORTENER_URL, params, function (response) {
              if (response.status_code === 200) {
                prompt('Copy the following link: ', response.data.url);
              } else {
                prompt('Copy the following link: ', window.location);
              }
            });
          };

          $scope.isFlashAvailable = function () {
            return FlashDetect.installed;
          };
        }

        // additional
        function getChartType(url) {
          var hash = url.split('/#')[1] || '';
          var _hashEncoded = encodeURI(decodeURIComponent(hash));
          if (!_hashEncoded) {
            return false;
          }

          var _urlModel = Urlon.parse(_hashEncoded);
          return _urlModel['chart-type'] || false;
        }

        function isChartTypesLoaded() {
          return !!$scope.validTools.length;
        }

        function isChartTypeValid(chartType) {
          if (!chartType || !isChartTypesLoaded()) {
            return false;
          }
          return $scope.validTools.indexOf(chartType) !== -1;
        }

        function makeParamsForUrlShortening() {
          return {
            access_token: 'c5c5bdef4905a307a3a64664b1d06add09c48eb8',
            longUrl: encodeURIComponent(document.URL)
          };
        }

        function getJSON(url, param, callback, err) {
          var request = new XMLHttpRequest();
          var pars = [];
          for (var i in param) {
            if (param.hasOwnProperty(i)) {
              pars.push(i + '=' + param[i]);
            }
          }
          request.open('GET', url + '?' + pars.join('&'), true);
          request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
              var data = JSON.parse(request.responseText);
              if (callback) {
                callback(data);
              }
            } else if (err) {
              err();
            }
          };
          request.onerror = function () {
            if (err) {
              err();
            }
          };
          request.send();
        }

        function updateGraph() {
          scrollTo(document.querySelector('.wrapper'), 0, 200, function () {
            $scope.activeTool = $scope.chartType;
            var placeholder = document.getElementById('vizabi-placeholder');
            // do not put data in $scope
            var tool = angular.copy($scope.tools[$scope.activeTool]);

            Vizabi.clearInstances();

            $scope.viz = vizabiFactory.render(tool.tool, placeholder, tool.opts);
            $scope.relatedItems = tool.relateditems;
            $scope.$apply();

            // send to google analytics
            $window.ga('send', 'pageview', {page: $location.url()});
          });
        }

        function scrollTo(element, to, duration, cb) {
          if (duration < 0) {
            return;
          }
          var difference = to - element.scrollTop;
          var perTick = difference / duration * 10;

          setTimeout(function () {
            element.scrollTop += perTick;
            if (element.scrollTop === to) {
              cb();
              return;
            }
            scrollTo(element, to, duration - 10, cb);
          }, 10);
        }

        function setUpSocialLinkHandlers() {
          /* eslint-disable max-len */
          var socialClassToUrl = {
            twitter: 'https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Fwww.gapminder.org&amp;related=Gapminder&amp;text=Gapminder&amp;tw_p=tweetbutton&amp;url=',
            facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
            mail: 'mailto:?subject=Gapminder&body='
          };
          /* eslint-enable max-len */

          var socialLinksSelector = Object.keys(socialClassToUrl).map(function (className) {
            return '.' + className;
          }).join(', ');

          _.toArray(document.querySelectorAll(socialLinksSelector)).forEach(function (socialLink) {
            socialLink.addEventListener('click', function (event) {
              event.preventDefault();

              var shareLinkWindow = window.open('');
              var params = makeParamsForUrlShortening();
              getJSON(BITLY_SHORTENER_URL, params, function (response) {
                var shortenedUrl = null;

                if (response.status_code === 200) {
                  shortenedUrl = response.data.url;
                } else {
                  shortenedUrl = window.location;
                }

                var selectedClassName = _.find(socialLink.classList, function (className) {
                  return socialClassToUrl[className];
                });

                shareLinkWindow.location.href = socialClassToUrl[selectedClassName] + shortenedUrl;
              });
            });
          });
        }
      }]);
};
