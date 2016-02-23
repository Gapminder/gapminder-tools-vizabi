module.exports = function (app, ToolHelper, ToolVizabiExternal) {
  app
    .factory("ServiceSuggestion", ['$http', 'ToolHelper', 'ToolVizabiExternal',
      function ($http, ToolHelper, ToolVizabiExternal) {

        /* ServiceSuggestion :: Setup */

        var logEnabled = true;
        var defaultChartType = "bubbles";

        var SERVICE_URL = 'http://52.48.200.43:3000/api/suggestions';


        /* ServiceSuggestion :: Vars */

        var chartTypeLabel;

        var requestState = {};
        var modelMarkersState = {};

        /* ServiceSuggestion :: API */

        return {
          'send': send,
          'getModelMarkersState': getModelMarkersState
        };


        /* ServiceSuggestion :: Private */

        function _getRequestData (data) {

          var measureList,
              measurePathX,
              measurePathY,
              entityConceptsRaw;


          var modelMin = data.minModel;
          var modelViz = data.vizModel;

          requestState = {};
          measureList = ToolVizabiExternal.getChartMeasures(chartTypeLabel);

          requestState.measures = [];

          measurePathX = 'state/marker/' + measureList['x'] + '/which';
          measurePathY = 'state/marker/' + measureList['y'] + '/which';

          // Setup State

          requestState.measures.push(ToolVizabiExternal.searchData(measurePathX, modelMin, modelViz));
          requestState.measures.push(ToolVizabiExternal.searchData(measurePathY, modelMin, modelViz));

          entityConceptsRaw = ToolVizabiExternal.searchData('state/entities/show/geo.cat', modelMin, modelViz) || [];
          requestState.entityConcepts = ToolVizabiExternal.convertFormatMismatchTo(entityConceptsRaw);

          requestState.time = ToolVizabiExternal.searchDataTime('state/time/value', modelMin, modelViz);
          requestState.entities = ToolVizabiExternal.searchDataEntities('state/entities/select', modelMin, modelViz, 'geo') || [];

        };

        function _getMarkersData (data) {

          var currentPath,
              currentMarkerData,
              colorPallet,
              colorPalletAll,
              indexColor,
              markerIndex,
              measureList,
              measurePathX,
              measurePathY;

          var markerSearch = ['size', 'stack', 'color'];

          var modelMin = data.minModel;
          var modelViz = data.vizModel;

          modelMarkersState = {};

          for(markerIndex = 0; markerIndex < markerSearch.length; markerIndex += 1) {

            currentPath = markerSearch[markerIndex];
            currentMarkerData = ToolVizabiExternal.searchData('state/marker/' + currentPath, modelMin, modelViz);

            if(currentMarkerData) {
              modelMarkersState[currentPath] = ToolVizabiExternal.setDefaultStructure(currentPath, modelMin, modelViz);
            }
          }

          // Marker :: Color :: Custom (Pallet)

          if(modelMarkersState['color']) {
            colorPallet = ToolVizabiExternal.searchData('state/marker/color/palette', modelMin, modelViz) || false;
            if(colorPallet) {
              modelMarkersState['color']['palette'] = {};
              colorPalletAll = colorPallet.get();
              for(indexColor in colorPalletAll) {
                if(indexColor != '_default') {
                  modelMarkersState['color']['palette'][indexColor] = colorPalletAll[indexColor].value;
                }
              }
            }
          }

          // Marker :: Measures

          measureList = ToolVizabiExternal.getChartMeasures(chartTypeLabel);

          measurePathX = 'state/marker/' + measureList['x'] + '/which';
          measurePathY = 'state/marker/' + measureList['y'] + '/which';

          modelMarkersState[measureList['x']] = {};
          modelMarkersState[measureList['x']]['which'] = ToolVizabiExternal.searchData(measurePathX, modelMin, modelViz);

          modelMarkersState[measureList['y']] = {};
          modelMarkersState[measureList['y']]['which'] = ToolVizabiExternal.searchData(measurePathY, modelMin, modelViz);

        };

        function log () {
          if(logEnabled) {
            console.log.apply(console, arguments);
          }
        };


        /* ServiceSnapshot :: Public */

        function getModelMarkersState () {
          return modelMarkersState;
        };

        function send (data, chartType) {

          chartTypeLabel = chartType;

          _getRequestData(data);
          _getMarkersData(data);

          log("ServiceSuggestions::send", requestState, modelMarkersState);
          return $http.post(SERVICE_URL, requestState);
        };

      }]);
};
