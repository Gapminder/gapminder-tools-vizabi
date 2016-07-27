'use strict';

var Urlon = require('URLON');
var Vizabi = require('vizabi');
var FlashDetect = require('./flash-detect');
var _ = require('lodash');

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

        // change hash handler

        $scope.$root.$on('$locationChangeSuccess', function (event, urlCurrent, urlPrevious, state, oldState) {

          const chartTypePrevious = getChartType(urlPrevious);
          const chartTypeCurrent = getChartType(urlCurrent);

          if(!isChartTypeValid(chartTypeCurrent)) {
            if(isChartTypesLoaded()) {
              // invalid URL, redirect to Home
              $location.url(HOME_URL);
            }
            return;
          }

          $scope.chartType = chartTypeCurrent;

          // reload chart if type was changed
          if(chartTypePrevious !== chartTypeCurrent) {
            updateGraph();
          }
        });

        // validate route

        const locationPath = $location.path() || '';
        const locationHash = $location.hash() || '';
        const REQUIRED_PATH = '/tools';
        const REQUIRED_PARAM = 'chart-type';
        const shouldNavigateToHome = (locationPath.indexOf(REQUIRED_PATH) == -1 || locationHash.indexOf(REQUIRED_PARAM) == -1);

        if (shouldNavigateToHome) {
          // invalid URL, redirect to Home
          $location.url(HOME_URL);
        }

        // preload items
        vizabiItems.getItems().then(function (items) {

          $scope.tools = items;
          $scope.validTools = Object.keys($scope.tools);

          // detect chart type
          $scope.chartType = getChartType($location.url());

          // load vizabi chart if type is Ok
          if(isChartTypeValid($scope.chartType)) {
            updateGraph();
          } else {
            // invalid URL, redirect to Home
            $location.url(HOME_URL);
          }
        });

        // setup scope and handlers
        controllerImplementation();

        return;

        // business logic

        function controllerImplementation() {

          var bitlyShortenerUrl = 'https://api-ssl.bitly.com/v3/shorten';

          $scope.embedVizabi = false;
          if ($location.search().embedded === 'true') {
            $scope.embedVizabi = true;
          }

          $scope.embedded = function () {
            $location.search('embedded', 'true');
            prompt('Copy link', $location.absUrl());
            $location.search('embedded', null);
          };

          setUpSocialLinkHandlers();

          // BITLY
          $scope.shareLink = function () {
            var params = makeParamsForUrlShortening();

            getJSON(bitlyShortenerUrl, params, function (response) {
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

        };

        // additional

        function getChartType(url) {
          let hash = url.split("#")[1] || '';
          let hashEncoded = encodeURI(decodeURIComponent(hash)) ;
          if(!hashEncoded) {
            return false;
          }
          let urlModel = Urlon.parse(hashEncoded);
          return urlModel['chart-type'] || false;
        }

        function isChartTypesLoaded() {
          return !!$scope.validTools.length;
        }
        function isChartTypeValid(chartType) {
          if(!chartType || !isChartTypesLoaded()) {
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
              getJSON(bitlyShortenerUrl, params, function (response) {
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
