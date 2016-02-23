module.exports = function (app, ToolHelper, ToolVizabiExternal) {
  app
    .factory("ServiceSnapshot", ['$http', 'ToolHelper', 'ToolVizabiExternal',
      function ($http, ToolHelper, ToolVizabiExternal) {

        /* ServiceSnapshot :: Setup */

        var logEnabled = true;
        var baseHref = ToolHelper.getBaseHref();

        var SERVICE_URL = baseHref + 'api/testmagicstep2';


        /* ServiceSnapshot :: Vars */

        var suggestionItems = [];

        var availableRules = {
          "parents_when_non_or_4_and_more_selected": 'Parents when non or 4 and more selected',
          "parent_when_one_selected": 'Parent when one selected',
          "parents_when_2_to_4_selected": 'Parents when 2 to 4 selected',
          "children_of_selected": 'Children of selected'
        };


        /* ServiceSnapshot :: API */

        return {
          'takeSnapshots': takeSnapshots
        };


        /* ServiceSnapshot :: Private */

        function _prepareContainer (rulesCount) {
          var i,
              maxLength;

          maxLength = Math.max(suggestionItems.length, rulesCount);
          if(suggestionItems) {
            for(i = 0; i < maxLength; i++) {
              if((i+1) > rulesCount) {
                suggestionItems.splice(i, 1);
              } else {
                suggestionItems[i] = ToolHelper.getLoadingSuggestionItemData();
              }
            }
          }
        };

        function _getRequestData (suggestionRules, modelMarkerState) {

          var i,
              keyRule,
              readyTime,
              entityConcepts,
              suggestion,
              requestRule,
              requests = {};

          for(keyRule in suggestionRules) {

            requestRule = {};
            suggestion = suggestionRules[keyRule];

            // Check :: Time

            readyTime = suggestion['time'].toString();

            requestRule['time'] = {
              'value' : readyTime,
              'start' : readyTime,
              'end' : readyTime
            };

            // Check :: activeEntities :: Model => entities/select

            requestRule['entities'] = {};
            requestRule['entities']['select'] = [];

            if(suggestion['activeEntities']) {
              for(i = 0; i < suggestion['activeEntities'].length; i += 1) {
                requestRule['entities']['select'].push({
                  geo: suggestion['activeEntities'],
                  trailStartTime: readyTime,
                  labelOffset: [0,0]
                });
              }
            }


            // Check :: entities :: Model => entities/show/geo

            requestRule['entities']['show'] = {};
            requestRule['entities']['show']['geo'] = suggestion['entities'].length ?
              suggestion['entities'] :
              [];


            // Check :: entityConcepts :: Model => entities/show/geo.cat

            entityConcepts = ToolVizabiExternal.convertFormatMismatchFrom(suggestion['entityConcepts']);
            requestRule['entities']['show']['geo.cat'] = entityConcepts.length ?
              entityConcepts :
              ToolVizabiExternal.getDefaultEntityShowData();

            // Merge Markers

            requestRule['marker'] = modelMarkerState;

            // Completed

            requests[keyRule] = {
              'state': requestRule
            };
          }

          return requests;
        };

        function _render (response, minModel, metaData) {

          var suggestionItem = {};

          if(response.data.error) {
            log("ServiceSnapshot::Image::Success::Error", response.data.error);
            return false;
          }
          log("ServiceSnapshot::Image::Success::Success");

          // Unset Restrictions
          ToolVizabiExternal.clearModelForLink(minModel);
          log("ServiceSnapshot::render::minModel", minModel);

          // Create New Layout Item

          suggestionItem = {
            'title': "Suggestion Ready!",
            'subtitle': availableRules[metaData.ruleLabel],
            'link': baseHref + metaData.chartType + "#" + URLON.stringify(minModel),
            'image': "data:image/png;base64," + response.data,
            'classLoading': ""
          };

          // Update Layout

          suggestionItems[metaData.ruleIndex] = suggestionItem;
        };

        function _processRequest (minModel, metaData) {

          var requestData = {
            'hash': URLON.stringify(minModel),
            'chartType': metaData.chartType
          };

          // Take Snapshot

          $http.post(SERVICE_URL, requestData).then(function (response) {
            _render(response, minModel, metaData);
          }.bind(this), function (response) {
            log("ServiceSnapshot::Image::Error", response);
          }.bind(this));
        };

        function log () {
          if(logEnabled) {
            console.log.apply(console, arguments);
          }
        };


        /* ServiceSnapshot :: Public */

        function takeSnapshots (suggestions, suggestionItemsScope, chartType, modelMarkerState) {

          suggestionItems = suggestionItemsScope || [];
          log("ServiceSnapshot::takeSnapshots::suggestions", suggestions);

          var rule,
              requests,
              ruleIndex,
              rulesCount,
              suggestionRules;

          if (!_.isEmpty(suggestions.data)) {

            ruleIndex = 0;

            suggestionRules = suggestions.data.data;
            rulesCount = _.keys(suggestionRules).length;

            requests = _getRequestData(suggestionRules, modelMarkerState);
            log("ServiceSnapshot::takeSnapshots::requests", requests);

            _prepareContainer(rulesCount);

            for (rule in requests) {

              _processRequest(requests[rule], {
                'ruleLabel': rule,
                'ruleIndex': ruleIndex,
                'chartType': chartType
              });

              ruleIndex++;
            }
          }
        };

      }]);
};
