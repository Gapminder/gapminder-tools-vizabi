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
              Vizabi.utils.extend(model, urlModel);
            }

            model.bind = model.bind || {};
            model.bind.persistentChange = onPersistentChange;

            function onPersistentChange(evt, minModel) {

              minModel = Vizabi.utils.diffObject(minModel, initialModel);
              window.location.hash = urlon.stringify(minModel);

              if(!_.isEmpty(minModel) && !/snapshot/.test(window.location.search)) {
                rxSubject.next({
                  minModel: minModel,
                  vizabi: this
                });
              }
            };

            rxSubject
              .distinctUntilChanged()
              .debounceTime(500)
              .subscribe(function(data) {

                console.log('rxSubject', data);
                var dataVizabi = data.vizabi;

                // Request Object Structure

                var requestState = {};



                // Calculate :: entities

                var targetModel;
                var foundEntities = [];
                var foundEntitiesRaw;

                if(data.minModel.state && data.minModel.state.entities && data.minModel.state.entities.select) {
                  targetModel = data.minModel;
                } else {
                  targetModel = data.vizabi;
                }

                foundEntitiesRaw = targetModel['state']['entities']['select'];

                for(var i = 0; i < foundEntitiesRaw.length; i += 1) {
                  foundEntities.push(foundEntitiesRaw[i]['geo']);
                }

                requestState.entities = foundEntities;



                // Calculate :: entityConcepts

                var foundEntityConcept = [];
                var foundEntityConceptRaw = [];

                if(data.minModel.state && data.minModel.state.entities && data.minModel.state.entities.show) {
                  targetModel = data.minModel;
                } else {
                  targetModel = data.vizabi;
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

                if(data.minModel.state && data.minModel.state.marker && data.minModel.state.marker.axis_x) {
                  targetModel = data.minModel;
                } else {
                  targetModel = data.vizabi;
                }

                foundMeasuresRaw = targetModel['state']['marker']['axis_x']['which'];
                foundMeasures.push(foundMeasuresRaw);

                if(data.minModel.state && data.minModel.state.marker && data.minModel.state.marker.axis_y) {
                  targetModel = data.minModel;
                } else {
                  targetModel = data.vizabi;
                }

                foundMeasuresRaw = targetModel['state']['marker']['axis_y']['which'];
                foundMeasures.push(foundMeasuresRaw);

                requestState.measures = foundMeasures;



                // Calculate :: time

                var foundTime;
                var foundTimeRaw;

                if(data.minModel.state && data.minModel.state.time) {
                  foundTime = data.minModel.state.time.value;
                } else {
                  foundTimeRaw = data.vizabi.state.time.value;
                  foundTime = new Date(foundTimeRaw).getFullYear().toString();
                }

                requestState.time = foundTime || "2015";

                console.log("requestState::", requestState);

                // data.vizabi.state.entities.dim;  :: geo
                // options.entitiy.dim              :: country,global,un_state,world_4region

                $http.post('http://192.168.1.98:3000/api/suggestions', requestState).then(function(response){
                //$http.post(baseHref + 'api/testmagicstep1', requestState).then(function(response){

                  console.log("Responce::Success", response);

                  if(!_.isEmpty(response.data)) {

                    var responseData = response.data.data;
                    var dataSend = {};
                    var ruleIndex = 0;

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

                        readyEntitiesShow.push(staticStateShowEntities[i]);
                      }


                      // child_mortality_rate_per1000
                      //staticState.measures[0] = "population";

                      // gdp_p_cap_const_ppp2011_dollar
                      //staticState.measures[1] = "child_mortality_rate_percent";

                      // SETUP MIN_MODEL

                      var mockMinModel = {
                        state : {
                          entities: {
                            select: readyEntities,
                            show: {
                              'geo.cat': readyEntitiesShow
                            }
                          },
                          marker: {
                            axis_x: {
                              //which: staticState.measures[0]
                              which: requestState.measures[0]
                            },
                            axis_y: {
                              //which: staticState.measures[1]
                              which: requestState.measures[1]
                            }
                          },
                          time : {
                            value: readyTime,
                            start: readyTime,
                            end: readyTime
                          }
                        }
                      };

                      console.log("Responce::mockMinModel", mockMinModel);

                      var requestImage = {
                        hash: URLON.stringify(mockMinModel),
                        chartType: 'bubbles',
                        minModel: mockMinModel,
                        ruleIndex: ruleIndex
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

            console.log("V::Vizabi ", VizabiInstance, initialModel);
            console.log("V::initialModel ", initialModel);

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
