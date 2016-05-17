'use strict';

const Vizabi = require('vizabi');
const swfobject = require('swfobject');

module.exports = function controller(app) {
  app
    .controller('gapminderToolsCtrl', [
      '$scope', '$route', '$routeParams', '$location', 'vizabiItems', 'vizabiFactory', '$window',
      function gapminderToolsCtrl($scope, $route, $routeParams, $location, vizabiItems, vizabiFactory, $window) {
        const placeholder = document.getElementById('vizabi-placeholder');
        let prevSlug = null;

        $scope.shareLink = function shareLink() {
          const address = 'https://api-ssl.bitly.com/v3/shorten';
          const params = {
            access_token: '8765eb3be5b975830e72af4e0949022cb53d9596',
            longUrl: encodeURIComponent(document.URL)
          };

          function getJSON(url, param, callback, err) {
            const request = new XMLHttpRequest();
            const pars = [];
            let index = null;

            for (index in param) {
              if (param.hasOwnProperty(index)) {
                pars.push(`${index}=${param[index]}`);
              }
            }
            request.open('GET', `${url}?${pars.join('&')}`, true);
            request.onload = function onload() {
              let data = null;
              const minRange = 200;
              const maxRange = 400;

              if (request.status >= minRange && request.status < maxRange) {
                data = JSON.parse(request.responseText);
                if (callback) {
                  callback(data);
                  return;
                }
              } else if (err) {
                err();
              }
            };
            request.onerror = function onerror() {
              if (err) {
                err();
              }
            };
            request.send();
          }

          getJSON(address, params, response => {
            if (response.status_code === '200') {
              prompt('Copy the following link: ', response.data.url);
            } else {
              prompt('Copy the following link: ', window.location);
            }
          });
        };

        $scope.isFlashAvailable = function isFlashAvailable() {
          const swfVersion = swfobject.getFlashPlayerVersion();

          if (swfVersion && (swfVersion.major || swfVersion.minor || swfVersion.release)) {
            return true;
          }
          return false;
        };

        $scope.loadingError = false;
        $scope.tools = {};
        $scope.validTools = [];
        $scope.relatedItems = [];

        // start off by getting all items
        vizabiItems.getItems().then(items => {
          $scope.tools = items;
          $scope.validTools = Object.keys($scope.tools);
          updateGraph();
        });

        $scope.$root.$on('$routeChangeStart', (event, state) => {
          const newSlug = state.params.slug;

          if (!prevSlug) {
            prevSlug = newSlug;
            return;
          }
          if (prevSlug !== newSlug) {
            prevSlug = newSlug;
            // and here we go, one more hack
            setTimeout(() => {
              window.location.href = window.location.href;
            }, 1);
            return;
          }
        });
        $scope.$root.$on('$routeUpdate', (event, state) => {
          const newSlug = state.params.slug;

          if (!prevSlug) {
            prevSlug = newSlug;
            return;
          }
          if (prevSlug !== newSlug) {
            prevSlug = newSlug;
            // and here we go, one more hack
            setTimeout(() => {
              window.location.href = window.location.href;
            }, 1);
            return;
          }
        });
        function updateGraph() {
          const validTools = $scope.validTools;
          const scrollToPosition = 200;

          if (validTools.length === 0) {
            return;
          }
          if (validTools.indexOf($routeParams.slug) === -1) {
            // $scope.loadingError = false;
            // redirect
            window.location.href = HOME_URL;
            return;
          }

          scrollTo(document.querySelector('.wrapper'), 0, scrollToPosition, () => {
            let tool = null;

            $scope.activeTool = $routeParams.slug;
            // do not put data in $scope
            tool = angular.copy($scope.tools[$scope.activeTool]);

            Vizabi.clearInstances();

            $scope.viz = vizabiFactory.render(tool.tool, placeholder, tool.opts);
            $scope.relatedItems = tool.relateditems;
            $scope.$apply();

            // send to google analytics
            $window.ga('send', 'pageview', {page: $location.url()});
          });
        }

        function scrollTo(element, to, duration, cb) {
          let difference = null;
          let perTick = null;
          const numberTimeout = 10;
          const numberPerTick = 10;

          if (duration < 0) {
            return;
          }

          difference = to - element.scrollTop;
          perTick = difference / duration * numberPerTick;

          setTimeout(() => {
            const numberDurationMinus = 10;

            element.scrollTop += perTick;
            if (element.scrollTop === to) {
              cb();
              return;
            }
            scrollTo(element, to, duration - numberDurationMinus, cb);
          }, numberTimeout);
        }
      }]);
};
