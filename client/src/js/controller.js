var Vizabi = require('vizabi');
var urlon = require('URLON');
var Rx = require('rxjs/Rx');

require('phantomjs-polyfill');
require('./services/phanthom-polyfills');

var ServiceSuggestion = require('./services/suggestion');
var ServiceSnapshot = require('./services/snapshot');

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

        //start off by getting all items
        vizabiItems.getItems().then(function (items) {

          var default_state_map = {
            "entities": {
              "show": {
                "geo.cat": ["global", "world_4region", "country", "un_state"]
              }
            },
            "marker": {
              "color": {
                "which": "geo",
                "palette": {
                  "asia": "#ff5872",
                  "africa": "#00d5e9",
                  "europe": "#ffe700",
                  "americas": "#7feb00"
                }
              }
            }
          };

          var default_state_bubble = angular.copy(default_state_map);
          default_state_bubble.marker["axis_y"] = {
              "which": "life_expectancy"
          };

          var default_state_mountain = angular.copy(default_state_map);
          default_state_mountain.marker["axis_y"] = {
            "which": "life_expectancy"
          };


          items.map.opts.state = default_state_map;
          items.bubbles.opts.state = default_state_bubble;
          items.mountain.opts.state = default_state_mountain;

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

        var clickHandlerSuggestion = new Rx.Subject();

        clickHandlerSuggestion
          .distinctUntilChanged(function (x, y) {
            return x.link === y.link;
          })
          .debounceTime(500)
          .subscribe(function(value) {
            var $event = value.$event;
            var link = value.link;

            if(/#/.test(link)) {
              console.log("relatedClickHandler::", arguments);
              $location.path(link);

              if($scope.viz) {

                var hash = link.substring(link.indexOf("#") + 1);
                var str = encodeURI(decodeURIComponent(hash));
                var urlModel = urlon.parse(str);

                // Can't affect Vizabi Model
                var reload = false;
                if(_.isEmpty(urlModel.state.entities.show)) {
                  urlModel.state.entities.show['geo.cat'] = [
                    "global", "world_4region", "country", "un_state"
                  ];
                  var reload = true;
                  //urlModel.state.entities.show['geo'] = [];
                  //$scope.viz.model.state.entities.set('show', urlModel.state.entities.show, true);
                }

                console.log("$scope.viz::", urlModel, $scope.viz);
                $scope.viz.model.set('state', urlModel.state);

                console.log("relatedClickHandler::Stop");

                window.location.hash = "#" + hash;
                $event.preventDefault();

                if(reload) {
                  setTimeout(function () {
                    window.location.reload();
                  },1);
                }
                //$scope.viz.triggerResize();
                return false;

                //$scope.viz.model.state = urlModel.state;
                //$scope.viz.triggerResize();
              }
            }
          });

        // Click Handler Related :: Suggestions
        $scope.relatedClickHandler = function ($event, link) {
          clickHandlerSuggestion.next({$event: $event, link: link});
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
            var chartType = tool.tool;

            Vizabi.clearInstances();


            var rxSubjectCallback = new Rx.Subject();



            $scope.persistantChangeCallBack = new Rx.Subject();
            $scope.serviceSuggestion = new ServiceSuggestion(chartType, {'$http': $http});

            $scope.persistantChangeCallBack
              .distinctUntilChanged()
              .debounceTime(500)
              .subscribe(function(data){
                var suggestionResult = $scope.serviceSuggestion.send(data);
                suggestionResult.then(function(response){

                  console.log("suggestionResult::Ok", response);
                  new ServiceSnapshot(response, $scope.serviceSuggestion, rxSubjectCallback);

                }, function(response){
                  console.log("suggestionResult::Error", response);
                });
              });

            $scope.viz = vizabiFactory.render(chartType, placeholder, tool.opts, $scope.persistantChangeCallBack);







            //$scope.viz = vizabiFactory.render(tool.tool, placeholder, tool.opts, rxSubjectCallback);
            //$scope.relatedItems = tool.relateditems;
            $scope.$apply();



            // ScreenShot :: Phantom Callback

            $scope.viz.on({'readyOnce': function () {
              console.log("Vizabi::readyOnce");
              if (window.callPhantom) {
                window.callPhantom('takeShot');
              }
            }});

            var rulesDescription = {
              'parents_when_non_or_4_and_more_selected': 'Parents when non or 4 and more selected',
              "parent_when_one_selected": 'Parent when one selected',
              "parents_when_2_to_4_selected": 'Parents when 2 to 4 selected',
              "children_of_selected": 'Children of selected'
            }



            rxSubjectCallback
              .subscribe(function(data){

              var suggestion = data.requestData.ruleIndex;
              var suggestions = data.requestData.ruleIndexTotal;
              var keyRule = data.requestData.keyRule;

              var bases = document.getElementsByTagName('base');
              var baseHref = null;
              if (bases.length > 0) {
                baseHref = bases[0].href;
              }

              if($scope.relatedItems) {
                for(var i = 0; i < $scope.relatedItems.length; i++) {
                  if((i+1) > suggestions) {
                    $scope.relatedItems.splice(i, 1);
                  } else {
                    $scope.relatedItems[i].title = "Loading ...";
                    $scope.relatedItems[i].subtitle = "";
                    $scope.relatedItems[i].link = "";
                    $scope.relatedItems[i].image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AIRDjYaNhWXvQAAAAxJREFUCNdj+P//PwAF/gL+3MxZ5wAAAABJRU5ErkJggg==";
                  }
                }
              }

              // REQUEST :: Screenshot
              $http.post(baseHref + 'api/testmagicstep2', data.requestData).then(function(response){

                console.log("Responce Image::Success");

                if(response.data.error) {
                  console.log("Responce Image::Success::Error");
                  return false;
                }

                console.log("Responce Image::Success::Success");

                //var responseImages = response.data.images;
                var responseImages = response.data;
                var imageSource = "data:image/png;base64," + responseImages;
                var link = baseHref + data.requestData.chartType + "#" + data.requestData.hash;

                console.log("relatedItems ::link::", link);

                $scope.relatedItems[suggestion] = {};
                $scope.relatedItems[suggestion].title = "Suggestion Ready!";
                $scope.relatedItems[suggestion].subtitle = rulesDescription[keyRule];
                $scope.relatedItems[suggestion].link = link;
                $scope.relatedItems[suggestion].image = imageSource;

              }, function(response){
                console.log("Responce Image::Error", response);
              });

            });

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
