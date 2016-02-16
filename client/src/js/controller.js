var Vizabi = require('vizabi');
var urlon = require('URLON');
var Rx = require('rxjs/Rx');
require('phantomjs-polyfill');

// DEP :: "polyfill-math": "0.0.1",
//require('polyfill-math');
// DEP :: "es5-shim": "^4.5.4",
//require('es5-shim');

module.exports = function (app) {
  app
    .controller('gapminderToolsCtrl', [
      '$scope', '$route', '$routeParams', '$location', 'vizabiItems', 'vizabiFactory', '$window', '$http',
      function ($scope, $route, $routeParams, $location, vizabiItems, vizabiFactory, $window, $http) {
        var placeholder = document.getElementById('vizabi-placeholder');

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

                console.log("$scope.viz::", urlModel, $scope.viz);
                $scope.viz.model.set('state', urlModel.state);

                //window.location.hash = "#" + hash;
                //$event.preventDefault();
                //return false;

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

            Vizabi.clearInstances();

            var rxSubjectCallback = new Rx.Subject();
            $scope.viz = vizabiFactory.render(tool.tool, placeholder, tool.opts, rxSubjectCallback);
            //$scope.relatedItems = tool.relateditems;
            $scope.$apply();



            // ScreenShot :: Phantom Callback

            $scope.viz.on({'readyOnce': function () {
              console.log("Vizabi::readyOnce");
              if (window.callPhantom) {
                window.callPhantom('takeShot');
              }
            }});





            rxSubjectCallback
              .subscribe(function(data){

              var suggestion = data.requestData.ruleIndex;

              var bases = document.getElementsByTagName('base');
              var baseHref = null;
              if (bases.length > 0) {
                baseHref = bases[0].href;
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
                $scope.relatedItems[suggestion].title = "Suggestion Ready!" + (suggestion + 1);
                $scope.relatedItems[suggestion].subtitle = "Suggestion Subtitle ...";
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
