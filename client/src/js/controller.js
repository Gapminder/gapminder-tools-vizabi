var Vizabi = require('vizabi');
var urlon = require('URLON');
var Rx = require('rxjs/Rx');
var _ = require('lodash');

require('phantomjs-polyfill');
require('./services/phanthom-polyfills');

var ServiceSuggestion = require('./services/suggestion');
var ServiceSnapshot = require('./services/snapshot');
var ToolVizabiExternal = require('./tools/vizabi.external.js');
var ToolHelper = require('./tools/helper');

module.exports = function (app) {
  app
    .controller('gapminderToolsCtrl', [
      '$scope', '$route', '$routeParams', '$location', 'vizabiItems', 'vizabiFactory', '$window', '$http',
      function ($scope, $route, $routeParams, $location, vizabiItems, vizabiFactory, $window, $http) {

        var placeholder = document.getElementById('vizabi-placeholder');
        var prevSlug = null;

        $scope.loadingError = false;
        $scope.tools = {};
        $scope.validTools = [];
        $scope.relatedItems = [];


        // Services Callbacks

        $scope.persistantChangeCallback = new Rx.Subject();
        $scope.suggestionClickHandlerRule = new Rx.Subject();

        $scope.serviceSnapshot = new ServiceSnapshot($scope.relatedItems, {'$http': $http});
        $scope.serviceSuggestion = null;

        setupSuggestionService();


        // Suggestions Click Handle :: UI

        $scope.suggestionClickHandler = function ($event, link) {
          $scope.suggestionClickHandlerRule.next({
            $event: $event,
            link: link
          });
        };


        //start off by getting all items
        vizabiItems.getItems().then(function (items) {

          ToolVizabiExternal.setupInitState(items);

          $scope.tools = items;
          $scope.validTools = Object.keys($scope.tools);
          updateGraph();
        });


        $scope.$root.$on('$routeChangeStart', function(event, state){
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
        $scope.$root.$on('$routeUpdate', function(event, state){
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
            var chartType = tool.tool;

            Vizabi.clearInstances();


            // Integrate Suggestion Service
            $scope.serviceSuggestion = new ServiceSuggestion(chartType, {'$http': $http});

            $scope.viz = vizabiFactory.render(chartType, placeholder, tool.opts, $scope.persistantChangeCallback);
            $scope.$apply();

            // Vizabi Ready

            $scope.viz.on({'readyOnce': function () {

              $scope.persistantChangeCallback.next({
                minModel: {},
                vizModel: $scope.viz.model
              });

              // ScreenShot :: Phantom Callback

              if (window.callPhantom) {
                window.callPhantom('takeShot');
              }
            }});

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
        };

        function setupSuggestionService () {

          // Setup Vizabi persistant Change Callback

          $scope.persistantChangeCallback
            .distinctUntilChanged()
            .debounceTime(500)
            .subscribe(function(data){
              if($scope.serviceSuggestion) {

                // Setup Suggestion Service Callback

                $scope.serviceSuggestion.send(data)
                  .then(function(response){
                    console.log("suggestionResult::Ok", response);
                    var chartType = $scope.serviceSuggestion.chartTypeLabel;
                    var modelMarkersState = $scope.serviceSuggestion.getModelMarkersState();
                    $scope.serviceSnapshot.takeSnapshots(response, chartType, modelMarkersState);
                  }, function(response){
                    console.log("suggestionResult::Error", response);
                  });
              }
            });

          // Setup Suggestions Click Handle Rules

          $scope.suggestionClickHandlerRule
            .distinctUntilChanged(function (x, y) {
              return x.link === y.link;
            })
            .debounceTime(500)
            .subscribe(function(value) {
              suggestionClickHandlerCallback(value);
            });


        };

        function suggestionClickHandlerCallback(value) {

          var $event = value.$event;
          var link = value.link;

          // Check that link contain Hash

          if(/#/.test(link)) {

            $location.path(link);

            if($scope.viz) {

              // Can't affect Vizabi Model
              //var canNotApplyChangesToModel = false;

              var hash = link.substring(link.indexOf("#") + 1);
              var str = encodeURI(decodeURIComponent(hash));
              var urlModel = urlon.parse(str);

              /*
              if(_.isEmpty(urlModel.state.entities.show['geo.cat'])) {
                urlModel.state.entities.show['geo.cat'] = [
                  "global", "world_4region", "country", "un_state"
                ];
                //canNotApplyChangesToModel = true;
              }
              */

              // Update Vizabi Model
              $scope.viz.model.set('state', urlModel.state);

              window.location.hash = "#" + hash;
              $event.preventDefault();

              // Check Case When Changes are not Applied
              /*
              if(canNotApplyChangesToModel) {
                setTimeout(function () {
                  window.location.reload();
                },1);
              }
              */

              return false;
            }
          }
        };

      }]);
};
