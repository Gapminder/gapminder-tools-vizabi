/*
module.exports = function (app) {
  app
    .factory("ServiceSuggestions", ['$http', function ($http) {
      return ServiceSuggestions


    }]);
};
*/

var ToolVizabiExternal = require('./../tools/vizabi/external.js');

var ServiceSuggestions = function (chartType, dependencies) {

  $http = dependencies['$http'];

  this.defaultChartType = "bubbles";
  this.chartTypeLabel = ToolVizabiExternal.getChartType(chartType, this.defaultChartType);

  this.modelState = {};

  /* Methods */

  this._getRequstData = function (data) {

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

    requestState.entityConcepts = ToolVizabiExternal.searchData('state/entities/show/geo.cat', modelMin, modelViz) || [];
    requestState.time = ToolVizabiExternal.searchDataTime('state/time/value', modelMin, modelViz);

    requestState.entities = ToolVizabiExternal.searchDataEntities('state/entities/select', modelMin, modelViz, 'geo') || [];

    return requestState;
  };

  this._getStateData = function (data) {

    var modelMin = data.minModel;
    var modelViz = data.vizModel;

    var modelStateAdditional = {};

    // Marker :: Size

    var markerSize = ToolVizabiExternal.searchData('state/marker/size', modelMin, modelViz);
    if(markerSize) {
      modelStateAdditional['size'] = {};
      modelStateAdditional['size']['which'] = ToolVizabiExternal.searchData('state/marker/size/which', modelMin, modelViz);
      modelStateAdditional['size']['use'] = ToolVizabiExternal.searchData('state/marker/size/use', modelMin, modelViz);
    }

    // Marker :: Stack

    var markerStack = ToolVizabiExternal.searchData('state/marker/stack', modelMin, modelViz);
    if(markerStack) {
      modelStateAdditional['stack'] = {};
      modelStateAdditional['stack']['which'] = ToolVizabiExternal.searchData('state/marker/stack/which', modelMin, modelViz);
      modelStateAdditional['stack']['use'] = ToolVizabiExternal.searchData('state/marker/stack/use', modelMin, modelViz);
    }

    // Marker :: Stack

    var markerColor = ToolVizabiExternal.searchData('state/marker/color', modelMin, modelViz);
    if(markerColor) {
      modelStateAdditional['color'] = {};
      modelStateAdditional['color']['which'] = ToolVizabiExternal.searchData('state/marker/color/which', modelMin, modelViz);
      modelStateAdditional['color']['use'] = ToolVizabiExternal.searchData('state/marker/color/use', modelMin, modelViz);

      var colorPallet = ToolVizabiExternal.searchData('state/marker/color/palette', modelMin, modelViz) || false;
      if(colorPallet) {
        modelStateAdditional['color']['palette'] = {};
        var colorPalletAll = colorPallet.get();
        for(var indexColor in colorPalletAll) {
          if(indexColor != '_default') {
            modelStateAdditional['color']['palette'][indexColor] = colorPalletAll[indexColor].value;
          }
        }
      }
    }

    return modelStateAdditional;
  };

  this.send = function (data) {

    var requestData = this._getRequstData(data);
    var modelState = this._getStateData(data);
    this.modelState = modelState;

    console.log("ServiceSuggestions::send", requestData, modelState);
    return $http.post('http://52.48.200.43:3000/api/suggestions', requestData);
  };

  return this;
};

module.exports = ServiceSuggestions;
