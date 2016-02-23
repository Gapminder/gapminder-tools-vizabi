var Vizabi = require('vizabi');
var urlon = require('URLON');
var Rx = require('rxjs/Rx');
var _ = require('lodash');

require('phantomjs-polyfill');
require('./services/phanthom-polyfills');

var ToolVizabiExternal = require('./tools/vizabi.external.js');

module.exports = function (app) {
  app
    .controller('gapminderToolsCtrl', [
      '$scope', '$route', '$routeParams', '$location', 'vizabiItems', 'vizabiFactory', '$window', '$http', 'ServiceSnapshot', 'ServiceSuggestion', 'ToolVizabiExternal',
      function ($scope, $route, $routeParams, $location, vizabiItems, vizabiFactory, $window, $http, ServiceSnapshot, ServiceSuggestion, ToolVizabiExternal) {

        var placeholder = document.getElementById('vizabi-placeholder');
        var prevSlug = null;
        var chartTypeLabel;

        $scope.loadingError = false;
        $scope.tools = {};
        $scope.validTools = [];
        $scope.relatedItems = [];



        // Services Callbacks

        $scope.persistantChangeCallback = new Rx.Subject();
        $scope.suggestionClickHandlerRule = new Rx.Subject();

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

            // Setup Chart Type
            chartTypeLabel = ToolVizabiExternal.getChartType(chartType);

            Vizabi.clearInstances();

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

              ServiceSuggestion.send(data, chartTypeLabel)
                .then(function(response){
                  var modelMarkersState = ServiceSuggestion.getModelMarkersState();
                  var suggestionItems = $scope.relatedItems;
                  ServiceSnapshot.takeSnapshots(response, suggestionItems, chartTypeLabel, modelMarkersState);
                }, function(response){
                  console.log("ServiceSuggestion::Error", response);
                });
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

          var hash,
              str,
              urlModel;

          var $event = value.$event;
          var link = value.link;

          // Check that link contain Hash

          if(/#/.test(link)) {
            //$location.path(link);
            if($scope.viz) {
              hash = link.substring(link.indexOf("#") + 1);
              str = encodeURI(decodeURIComponent(hash));
              urlModel = urlon.parse(str);

              // Update Vizabi Model
              $scope.viz.model.set('state', urlModel.state);

              window.location.hash = "#" + hash;
              $event.preventDefault();
              return false;
            }
          }
        };
      }]);
};
