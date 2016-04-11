var Vizabi = require('vizabi');

module.exports = function (app) {
  app
    .controller('gapminderToolsCtrl', [
      '$scope', '$route', '$routeParams', '$location', 'vizabiItems', 'vizabiFactory', '$window',
      function ($scope, $route, $routeParams, $location, vizabiItems, vizabiFactory, $window) {
        var placeholder = document.getElementById('vizabi-placeholder');

        $scope.shareLink = function () {
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

          //BITLY
          var address = 'https://api-ssl.bitly.com/v3/shorten',
            params = {
              access_token: '8765eb3be5b975830e72af4e0949022cb53d9596',
              longUrl: encodeURIComponent(document.URL)
            };
          getJSON(address, params, function (response) {
            if (response.status_code === '200') {
              prompt('Copy the following link: ', response.data.url);
            } else {
              prompt('Copy the following link: ', window.location);
            }
          });

        };


        $scope.loadingError = false;
        $scope.tools = {};
        $scope.validTools = [];
        $scope.relatedItems = [];

        //start off by getting all items
        vizabiItems.getItems().then(function (items) {
          $scope.tools = items;
          $scope.validTools = Object.keys($scope.tools);
          updateGraph();
        });

        var prevSlug = null;
        $scope.$root.$on('$routeChangeStart', function (event, state) {
          var newSlug = state.params.slug;
          if (!prevSlug) {
            prevSlug = newSlug;
            return;
          }
          if (prevSlug !== newSlug) {
            prevSlug = newSlug;
            // and here we go, one more hack
            setTimeout(function () {
              window.location.href = window.location.href;
            }, 1);
            return;
          }
        });
        $scope.$root.$on('$routeUpdate', function (event, state) {
          var newSlug = state.params.slug;
          if (!prevSlug) {
            prevSlug = newSlug;
            return;
          }
          if (prevSlug !== newSlug) {
            prevSlug = newSlug;
            // and here we go, one more hack
            setTimeout(function () {
              window.location.href = window.location.href;
            }, 1);
            return;
          }
        });
        function updateGraph() {
          var validTools = $scope.validTools;
          if (validTools.length === 0) {
            return;
          }
          if (validTools.indexOf($routeParams.slug) === -1) {
            // $scope.loadingError = false;
            //redirect
            window.location.href = HOME_URL;
            return;
          }

          scrollTo(document.querySelector('.wrapper'), 0, 200, function () {
            $scope.activeTool = $routeParams.slug;
            // do not put data in $scope
            var tool = angular.copy($scope.tools[$scope.activeTool]);

            Vizabi.clearInstances();

            $scope.viz = vizabiFactory.render(tool.tool, placeholder, tool.opts);
            $scope.relatedItems = tool.relateditems;
            $scope.$apply();

            //send to google analytics
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
            element.scrollTop = element.scrollTop + perTick;
            if (element.scrollTop === to) {
              cb();
              return;
            }
            scrollTo(element, to, duration - 10, cb);
          }, 10);
        }
      }]);
};
