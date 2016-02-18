
var ToolVizabiExternal = require('./../tools/vizabi/external.js');

var ServiceSnapshot = function (response, serviceSuggestion, rxSubjectCallback) {


  var modelState = serviceSuggestion.modelState;
  var measureList = ToolVizabiExternal.getChartMeasures(serviceSuggestion.chartTypeLabel);

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

      mockMinModel.state.marker = modelState;

      mockMinModel.state.marker[measureList['x']] = {which: staticState.measures[0]};
      mockMinModel.state.marker[measureList['y']] = {which: staticState.measures[1]};

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

      if("map" == serviceSuggestion.chartTypeLabel) {
        delete mockMinModel.state.marker[measureList['x']];
        delete mockMinModel.state.marker[measureList['y']];
      }

      // Ready mockMinModel
      console.log("Responce::mockMinModel", mockMinModel);

      var requestImage = {
        hash: URLON.stringify(mockMinModel),
        chartType: serviceSuggestion.chartTypeLabel,
        minModel: mockMinModel,
        ruleIndexTotal: ruleIndexTotal,
        ruleIndex: ruleIndex,
        keyRule: keyRule
      };


      rxSubjectCallback.next({
        'requestData': requestImage
      });

      ruleIndex++;
    }
  }


  return this;
};

module.exports = ServiceSnapshot;
