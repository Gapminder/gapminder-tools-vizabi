var d3 = require('d3');
var Vizabi = require('vizabi');
var urlon = require('URLON');

var _ = require('lodash');
var Rx = require('rxjs/Rx');

//require('polyfill-math');


// ScreenShot :: Phantom :: Math.sign polyfill

Math.sign = Math.sign || function(x) {
  x = +x; // convert to a number
  if (x === 0 || isNaN(x)) {
    return x;
  }
  return x > 0 ? 1 : -1;
}





module.exports = function (app) {
  var bases = document.getElementsByTagName('base');
  var baseHref = null;
  if (bases.length > 0) {
    baseHref = bases[0].href;
  }


  var mappingChartTypeList = {
    'BubbleChart': "bubbles",
    'MountainChart': "mountain",
    'BubbleMap': "map",
    'BarChart': "bar",
    'BarRankChart': "barrank",
    'LineChart': "line",
    'PopByAge': "pop"
  };

  var mappingChartTypeMeasures = {
    "bubbles": {
      x: "axis_x",
      y: "axis_y"
    },
    "map": {
      x: "lat",
      y: "lng"
    },
    "mountain": {
      x: "axis_x",
      y: "axis_y"
    }
  };


  app
    .factory("vizabiFactory", ['$http',
      function ($http) {
        return {
          /**
           * Render Vizabi
           * @param {String} tool name of the tool
           * @param {DOMElement} placeholder
           * @return {Object}
           */
          render: function (tool, placeholder, model, subjectCallback) {
            var loc = window.location.toString();
            var hash = null;
            var initialModel = Vizabi.utils.deepClone(model);
            var rxSubject = new Rx.Subject();

            if (loc.indexOf('#') >= 0) {
              hash = loc.substring(loc.indexOf('#') + 1);
            }

            if (hash) {

              var str = encodeURI(decodeURIComponent(hash));
              var urlModel = urlon.parse(str);

              Vizabi.utils.deepExtend(model, urlModel);
              //model = Vizabi.utils.diffObject(urlModel, model);
            }

            model.bind = model.bind || {};
            model.bind.persistentChange = onPersistentChange;

            function onPersistentChange(evt, minModel) {

              //console.log("onPersistentChange::", minModel);

              minModel = Vizabi.utils.diffObject(minModel, initialModel);
              window.location.hash = urlon.stringify(minModel);

              if(!_.isEmpty(minModel) && !/snapshot/.test(window.location.search)) {

                var chartType = mappingChartTypeList[tool] ? mappingChartTypeList[tool] : "bubbles";

                rxSubject.next({
                  minModel: minModel,
                  vizabi: this,
                  chartType: chartType
                });
              }
            };

            rxSubject
              .distinctUntilChanged()
              .debounceTime(500)
              .subscribe(function(data) {

                console.log('rxSubject', data);

                var dataVizabi = data.vizabi;
                var chartType = data.chartType;




                // Request Object Structure

                var requestState = {};



                // Calculate :: entities

                var targetModel;
                var foundEntities = [];
                var foundEntitiesRaw;

                if(data.minModel.state && data.minModel.state.entities && data.minModel.state.entities.select) {
                  targetModel = data.minModel;
                } else {
                  targetModel = dataVizabi;
                }

                foundEntitiesRaw = targetModel['state']['entities']['select'];

                for(var i = 0; i < foundEntitiesRaw.length; i += 1) {
                  foundEntities.push(foundEntitiesRaw[i]['geo']);
                }

                requestState.entities = foundEntities;



                // Calculate :: entityConcepts

                var foundEntityConcept = [];
                var foundEntityConceptRaw = [];

                if(data.minModel.state && data.minModel.state.entities && data.minModel.state.entities.show && data.minModel.state.entities.show['geo.cat']) {
                  targetModel = data.minModel;
                } else {
                  targetModel = dataVizabi;
                }

                if(targetModel['state']['entities']['show'] && targetModel['state']['entities']['show']['geo.cat']) {
                  foundEntityConceptRaw = targetModel['state']['entities']['show']['geo.cat'].map(function(v) {
                    return v === 'unstate' ? 'un_state' : v;
                  });
                }

                requestState.entityConcepts = foundEntityConceptRaw;



                // Calculate :: measures

                var foundMeasures = [];
                var foundMeasuresRaw;

                var measureX = mappingChartTypeMeasures[chartType]['x'];
                var measureY = mappingChartTypeMeasures[chartType]['y'];




                if(data.minModel.state && data.minModel.state.marker && data.minModel.state.marker[measureX] && data.minModel.state.marker[measureX]['which']) {
                  targetModel = data.minModel;
                } else {
                  targetModel = dataVizabi;
                }

                foundMeasuresRaw = targetModel['state']['marker'][measureX]['which'];
                foundMeasures.push(foundMeasuresRaw);

                if(data.minModel.state && data.minModel.state.marker && data.minModel.state.marker[measureY] && data.minModel.state.marker[measureY]['which']) {
                  targetModel = data.minModel;
                } else {
                  targetModel = dataVizabi;
                }

                foundMeasuresRaw = targetModel['state']['marker'][measureY]['which'];
                foundMeasures.push(foundMeasuresRaw);

                requestState.measures = foundMeasures;



                // Calculate :: time

                var foundTime;
                var foundTimeRaw;

                if(data.minModel.state && data.minModel.state.time) {
                  foundTime = data.minModel.state.time.value;
                } else {
                  foundTimeRaw = dataVizabi.state.time.value;
                  foundTime = new Date(foundTimeRaw).getFullYear().toString();
                }

                requestState.time = foundTime || "2015";



                // Calculate :: Markers

                requestStateMarker = {};

                // Calculate :: Size

                var foundSize;
                var foundSizeUse;

                if(data.minModel.state && data.minModel.state.marker && data.minModel.state.marker.size) {
                  targetModel = data.minModel;
                } else {
                  targetModel = dataVizabi;
                }

                if(targetModel['state']['marker']["size"]) {
                  foundSize = targetModel['state']['marker']["size"]['which'];
                  foundSizeUse = dataVizabi['state']['marker']["size"]['use'] || false;
                  requestStateMarker.size = {which: foundSize};
                  if(foundSizeUse) {
                    requestStateMarker.size['use'] = foundSizeUse;
                  }
                }

                // Calculate :: Stack

                var foundStack;
                var foundStackUse;

                if(data.minModel.state && data.minModel.state.marker && data.minModel.state.marker.stack) {
                  targetModel = data.minModel;
                } else {
                  targetModel = dataVizabi;
                }

                if(targetModel['state']['marker']["stack"]) {
                  foundStack = targetModel['state']['marker']["stack"]['which'];
                  foundStackUse = dataVizabi['state']['marker']["stack"]['use'] || false;
                  requestStateMarker.stack = {which: foundStack};
                  if(foundStackUse) {
                    requestStateMarker.stack['use'] = foundStackUse;
                  }
                }


                // Calculate :: Color Pallet

                var foundColor;
                var foundColorUse;
                var foundColorPallet;

                if(data.minModel.state && data.minModel.state.marker && data.minModel.state.marker.color) {
                  targetModel = data.minModel;
                } else {
                  targetModel = dataVizabi;
                }

                if(targetModel['state']['marker']["color"]) {
                  foundColor = targetModel['state']['marker']["color"]['which'];
                  foundColorUse = dataVizabi['state']['marker']["color"]['use'] || false;
                  foundColorPallet = dataVizabi['state']['marker']["color"]['palette'] || false;

                  requestStateMarker.color = {which: foundColor};
                  if(foundColorUse) {
                    requestStateMarker.color['use'] = foundColorUse;
                  }
                  if(foundColorPallet) {
                    requestStateMarker.color['palette'] = {};
                    var foundColorPalletAll = foundColorPallet.get();
                    for(var index in foundColorPalletAll) {
                      if(index != '_default') {
                        requestStateMarker.color['palette'][index] = foundColorPalletAll[index].value;
                      }
                    }
                  }
                }


                // Ready requestState
                console.log("requestState::", requestState);
                requestState.temp = '22';
                var bases = document.getElementsByTagName('base');
                var baseHref = null;
                if (bases.length > 0) {
                  baseHref = bases[0].href;
                }
                $http.post( baseHref + 'api/suggestions', requestState).then(function(response){
                //$http.post(baseHref + 'api/testmagicstep1', requestState).then(function(response){

                  console.log("Responce::Success", response);

                  if(!_.isEmpty(response.data)) {

                    var responseData = response.data.data;
                    var dataSend = {};

                    var ruleIndex = 0;
                    var ruleIndexTotal = 0;

                    for(var keyRule in responseData) {
                      ruleIndexTotal++;
                    }

                    for(var keyRule in responseData) {

                      var staticState = responseData[keyRule];
                      var readyTime = staticState.time.toString();

                      if(staticState.activeEntities) {

                        var staticStateEntities = staticState.activeEntities;
                        var readyEntities = [];

                        for(var i = 0; i < staticStateEntities.length; i += 1) {
                          if(staticStateEntities[i]) {
                            readyEntities.push({
                              geo: staticStateEntities[i],
                              trailStartTime: readyTime,
                              labelOffset: [0,0]
                              //labelOffset: Array[2]
                            });
                          }
                        }
                      } else {
                        readyEntities = [];
                      }

                      var staticStateShowEntities = staticState.entityConcepts;
                      var readyEntitiesShow = [];

                      for(var i = 0; i < staticStateShowEntities.length; i += 1) {

                        if(staticStateShowEntities[i] === 'un_state') {
                          staticStateShowEntities[i] = 'unstate';
                        }

                        // skip empty
                        if(!_.isEmpty(staticStateShowEntities[i])) {
                          readyEntitiesShow.push(staticStateShowEntities[i]);
                        }
                      }

                      var staticStateVisibleEntities = staticState.entities;
                      var readyEntitiesVisible = [];

                      for(var i = 0; i < staticStateVisibleEntities.length; i += 1) {
                        // skip empty
                        if(!_.isEmpty(staticStateVisibleEntities[i])) {
                          readyEntitiesVisible.push(staticStateVisibleEntities[i]);
                        }
                      }



                      // SETUP :: MIN_MODEL

                      var mockMinModel = {
                        state : {
                          entities: {
                            select: readyEntities
                          },
                          time : {
                            value: readyTime
                          }
                        }
                      };

                      // SETUP :: MIN_MODEL :: measures

                      mockMinModel.state.marker = requestStateMarker;

                      mockMinModel.state.marker[measureX] = {which: requestState.measures[0]};
                      mockMinModel.state.marker[measureY] = {which: requestState.measures[1]};

                      // SETUP :: Additional :: Time (start/End)

                      //mockMinModel.state.time['start'] = readyTime;
                      //mockMinModel.state.time['end'] = readyTime;

                      // SETUP :: Additional :: Entities (show)

                      if(!mockMinModel.state.entities.show) {
                        mockMinModel.state.entities.show = {};
                      }
                      if(readyEntitiesShow.length) {
                        mockMinModel.state.entities.show['geo.cat'] = readyEntitiesShow;
                      }

                      // SETUP :: Additional :: Entities (visible)

                      if(readyEntitiesVisible.length) {
                        if(!mockMinModel.state.entities.show) {
                          mockMinModel.state.entities.show = {};
                        }
                        mockMinModel.state.entities.show['geo'] = readyEntitiesVisible;
                      }

                      // SETUP Exception

                      if("map" == chartType) {
                        delete mockMinModel.state.marker[measureX];
                        delete mockMinModel.state.marker[measureY];
                      }

                      /*

                      if(requestState['size']) {
                        if(!mockMinModel.state.marker) {
                          mockMinModel.state.marker = {};
                        }
                        mockMinModel.state.marker["size"] = {which: requestState['size']};
                      }

                      if(requestState['stack']) {
                        if(!mockMinModel.state.marker) {
                          mockMinModel.state.marker = {};
                        }
                        mockMinModel.state.marker["stack"] = {which: requestState['stack']};
                      }

                      */

                      // Ready mockMinModel
                      console.log("Responce::mockMinModel", mockMinModel);

                      var requestImage = {
                        hash: URLON.stringify(mockMinModel),
                        chartType: chartType,
                        minModel: mockMinModel,
                        ruleIndexTotal: ruleIndexTotal,
                        ruleIndex: ruleIndex,
                        keyRule: keyRule
                      };


                      subjectCallback.next({
                        'requestData': requestImage
                      });

                      ruleIndex++;

                      //break;
                      // URLON.stringify(minModel)
                      // URLON.parse(encodeURI(decodeURIComponent(hash)));
                    }
                  }
                }, function(response){
                  console.log("Responce::Error", response);
                });

              });

            var VizabiInstance = Vizabi(tool, placeholder, model);

            //console.log("V::Vizabi ", VizabiInstance, initialModel);
            //console.log("V::initialModel ", initialModel);

            return VizabiInstance;
          }
        };
      }]);


  app
    .factory("vizabiItems", ['$http', function ($http) {

      return {
        /**
         * Get All Items
         */
        getItems: function () {
          //return the promise directly.
          return $http.get(baseHref + 'api/item')
            .then(function (result) {
              var items = {}, i, s;
              for (i = 0, s = result.data.length; i < s; i++) {
                items[result.data[i].slug] = result.data[i];
              }
              return items;
            });
        }
      };

    }]);

  app
    .factory('menuFactory', [
      '$location', '$q', '$http',
      function ($location, $q, $http) {

        return {
          cached: [],

          /**
           * Get All Items
           */
          getMenu: function () {
            //return the promise directly.
            var _this = this;
            return $http.get(baseHref + 'api/menu')
              .then(function (result) {
                if (result.status === 200) {
                  _this.cached = result.data.children;
                }
                return _this.getCachedMenu();
              });
          },

          /**
           * Returns the home tree data.
           * @returns {}
           */
          getCachedMenu: function () {
            return this.cached;
          },

          /**
           * Returns the current URL.
           * @returns {string}
           */
          getCurrentUrl: function () {
            return $location.$$path;
          }
        };
      }]);
};
