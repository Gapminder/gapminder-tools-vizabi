/*
module.exports = function (app) {
  app
    .factory("ServiceSuggestions", ['$http', function ($http) {
      return ServiceSuggestions


    }]);
};
*/

var ToolVizabiExternal = require('./../tools/vizabi.external.js');

var ServiceSuggestions = function (chartType, dependencies) {

  $http = dependencies['$http'];

  this.defaultChartType = "bubbles";
  this.serviceUrl = 'http://52.48.200.43:3000/api/suggestions';
  this.chartTypeLabel = ToolVizabiExternal.getChartType(chartType, this.defaultChartType);

  this.modelMarkersState = {};

  /* Methods */

  this._getRequestData = function (data) {

    var modelMin = data.minModel;
    var modelViz = data.vizModel;

    var requestState = {};
    var measureList = ToolVizabiExternal.getChartMeasures(this.chartTypeLabel);

    requestState.measures = [];

    var measurePathX = 'state/marker/' + measureList['x'] + '/which';
    var measurePathY = 'state/marker/' + measureList['y'] + '/which';

    // Setup State

    requestState.measures.push(ToolVizabiExternal.searchData(measurePathX, modelMin, modelViz));
    requestState.measures.push(ToolVizabiExternal.searchData(measurePathY, modelMin, modelViz));

    var entityConceptsRaw = ToolVizabiExternal.searchData('state/entities/show/geo.cat', modelMin, modelViz) || [];
    requestState.entityConcepts = ToolVizabiExternal.convertFormatMismatchTo(entityConceptsRaw);

    requestState.time = ToolVizabiExternal.searchDataTime('state/time/value', modelMin, modelViz);
    requestState.entities = ToolVizabiExternal.searchDataEntities('state/entities/select', modelMin, modelViz, 'geo') || [];

    return requestState;
  };

  this._getMarkersData = function (data) {

    var modelMin = data.minModel;
    var modelViz = data.vizModel;

    var modelMarkersState = {};

    // Marker :: Size

    var markerSize = ToolVizabiExternal.searchData('state/marker/size', modelMin, modelViz);
    if(markerSize) {
      modelMarkersState['size'] = {};
      modelMarkersState['size']['which'] = ToolVizabiExternal.searchData('state/marker/size/which', modelMin, modelViz);
      modelMarkersState['size']['use'] = ToolVizabiExternal.searchData('state/marker/size/use', modelMin, modelViz);
    }

    // Marker :: Stack

    var markerStack = ToolVizabiExternal.searchData('state/marker/stack', modelMin, modelViz);
    if(markerStack) {
      modelMarkersState['stack'] = {};
      modelMarkersState['stack']['which'] = ToolVizabiExternal.searchData('state/marker/stack/which', modelMin, modelViz);
      modelMarkersState['stack']['use'] = ToolVizabiExternal.searchData('state/marker/stack/use', modelMin, modelViz);
    }

    // Marker :: Color

    var markerColor = ToolVizabiExternal.searchData('state/marker/color', modelMin, modelViz);
    if(markerColor) {
      modelMarkersState['color'] = {};
      modelMarkersState['color']['which'] = ToolVizabiExternal.searchData('state/marker/color/which', modelMin, modelViz);
      modelMarkersState['color']['use'] = ToolVizabiExternal.searchData('state/marker/color/use', modelMin, modelViz);

      var colorPallet = ToolVizabiExternal.searchData('state/marker/color/palette', modelMin, modelViz) || false;
      if(colorPallet) {
        modelMarkersState['color']['palette'] = {};
        var colorPalletAll = colorPallet.get();
        for(var indexColor in colorPalletAll) {
          if(indexColor != '_default') {
            modelMarkersState['color']['palette'][indexColor] = colorPalletAll[indexColor].value;
          }
        }
      }
    }

    // Marker :: Measures

    var measureList = ToolVizabiExternal.getChartMeasures(this.chartTypeLabel);

    var measurePathX = 'state/marker/' + measureList['x'] + '/which';
    var measurePathY = 'state/marker/' + measureList['y'] + '/which';

    modelMarkersState[measureList['x']] = {};
    modelMarkersState[measureList['x']]['which'] = ToolVizabiExternal.searchData(measurePathX, modelMin, modelViz);

    modelMarkersState[measureList['y']] = {};
    modelMarkersState[measureList['y']]['which'] = ToolVizabiExternal.searchData(measurePathY, modelMin, modelViz);


    return modelMarkersState;
  };

  this.getModelMarkersState = function () {
    return this.modelMarkersState;
  };

  this.send = function (data) {

    var requestData = this._getRequestData(data);
    this.modelMarkersState = this._getMarkersData(data);

    console.log("ServiceSuggestions::send", requestData, this.modelMarkersState);
    return $http.post(this.serviceUrl, requestData);
  };

  return this;
};

module.exports = ServiceSuggestions;
