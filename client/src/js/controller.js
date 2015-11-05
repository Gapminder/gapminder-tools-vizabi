var Vizabi = require('vizabi');

module.exports = function (app) {
  app
    .controller('gapminderToolsCtrl', [
      '$scope', '$route', '$routeParams', '$location', 'vizabiItems', 'vizabiFactory', '$window', 'config',
      function ($scope, $route, $routeParams, $location, vizabiItems, vizabiFactory, $window, config) {
        console.log('start controller');
        console.log(config);

        var placeholder = document.getElementById('vizabi-placeholder');
        var prevSlug = null;

        init();

        function init() {
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
        }

        $scope.$root.$on('$routeChangeStart', function(event, state, current){
          var newSlug = state.params.slug;
          if (!prevSlug) {
            prevSlug = newSlug;
            return;
          }
          if (prevSlug !== newSlug) {
            prevSlug = newSlug;
            // and here we go, one more hack
            if (config.isChromeApp) {
              init();
            } else {
              window.location.reload();
            }
            return;
          }
          console.log(window.location.hash);
        });
        $scope.$root.$on('$routeUpdate', function(event, state){
          var newSlug = state.params.slug;
          if (!prevSlug) {
            prevSlug = newSlug;
            return;
          }
          if (prevSlug !== newSlug) {
            prevSlug = newSlug;
            // and here we go, one more hack
            window.location.reload();
            return;
          }
          console.log(window.location.hash);
        });

        $scope.url = function(url) {
          if (config.isChromeApp) {
            $location.path(url);
          } else {
            $window.location.href = url;
          }
        };

        function updateGraph() {
          var validTools = $scope.validTools;
          if (validTools.length === 0) return;
          if (validTools.indexOf($routeParams.slug) === -1) {
            //redirect
            $location.path('/' + validTools[0]);
            return;
          }

          scrollTo(document.querySelector('.wrapper'), 0, 200, function () {
            $scope.activeTool = $routeParams.slug;
            // do not put data in $scope
            var tool = angular.copy($scope.tools[$scope.activeTool]);

            Vizabi.clearInstances();

            if (config.isChromeApp) {
              //set protocol
              tool.opts.data.path = 'http:' + tool.opts.data.path;
              for (var i=0; i < tool.relateditems.length; i++) {
                tool.relateditems[i].image = 'http:'+tool.relateditems[i].image;
              }
            }
            $scope.viz = vizabiFactory.render(tool.tool, placeholder, tool.opts);
            $scope.relatedItems = tool.relateditems;
            $scope.$apply();

            //send to google analytics
            //@todo:does ga needed in chrome/electron?
            //$window.ga('send', 'pageview', {page: $location.url()});
          });
        }

        function scrollTo(element, to, duration, cb) {
          if (duration < 0) return;
          var difference = to - element.scrollTop;
          var perTick = difference / duration * 10;

          setTimeout(function () {
            element.scrollTop = element.scrollTop + perTick;
            if (element.scrollTop == to) {
              cb();
              return;
            }
            scrollTo(element, to, duration - 10, cb);
          }, 10);
        }
      }]);
};
