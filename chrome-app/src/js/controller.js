var Vizabi = require('vizabi');

module.exports = function (app) {
  app
    .controller('gapminderToolsCtrl', [
      '$scope', '$route', '$routeParams', '$location', 'vizabiItems', 'vizabiFactory', '$window',
      function ($scope, $route, $routeParams, $location, vizabiItems, vizabiFactory, $window) {
        console.log('start controller');
        var placeholder = document.getElementById('vizabi-placeholder');

        $scope.loadingError = false;
        $scope.tools = {};
        $scope.validTools = [];
        $scope.relatedItems = [];

        //start off by getting all items
        vizabiItems.getItems().then(function (items) {
          console.log('getItems cb');
          $scope.tools = items;
          $scope.validTools = Object.keys($scope.tools);
          updateGraph();
        });

        var prevSlug = null;
        $scope.$root.$on('$routeChangeStart', function(event, state){
          console.log('start $routeChangeStart');
          console.log(event);
          console.log(state);
          var newSlug = state.params.slug;
          if (!prevSlug) {
            console.log(1);
            console.log('prevSlug:'+ prevSlug);
            console.log('newSlug:'+ newSlug);
            prevSlug = newSlug;
            return;
          }
          if (prevSlug !== newSlug) {
            console.log(2);
            prevSlug = newSlug;
            // and here we go, one more hack
            window.location.reload();
            return;
          }
          console.log(3);
          console.log(window.location.hash);
        });
        $scope.$root.$on('$routeUpdate', function(event, state){
          console.log('start $routeUpdate');
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
        function updateGraph() {
          console.log('start updateGraph');
          var validTools = $scope.validTools;
          if (validTools.length === 0) return;
          if (validTools.indexOf($routeParams.slug) === -1) {
            console.log('updateGraph redirect');
            //redirect
            $location.path('/' + validTools[0]);
            return;
          }

          scrollTo(document.querySelector('.wrapper'), 0, 200, function () {
            console.log('start scrollTo cb');
            //return;
            $scope.activeTool = $routeParams.slug;
            // do not put data in $scope
            var tool = angular.copy($scope.tools[$scope.activeTool]);

            Vizabi.clearInstances();
            console.log('start:');
            console.log(tool.tool);
            console.log(placeholder);
            console.log(tool.opts);
            $scope.viz = vizabiFactory.render(tool.tool, placeholder, tool.opts);
            $scope.relatedItems = tool.relateditems;
            $scope.$apply();
            console.log('end scrollTo cb');
            //send to google analytics
            $window.ga('send', 'pageview', {page: $location.url()});
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
