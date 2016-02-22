
var _ = require('lodash');

var ToolHelper = require('./../tools/helper');
var ToolVizabiExternal = require('./../tools/vizabi.external.js');


var ServiceSnapshot = function (suggestionItems, dependencies) {

  $http = dependencies['$http'];
  this.suggestionItems = suggestionItems;

  this.baseHref = ToolHelper.getBaseHref();
  this.serviceUrl = this.baseHref + 'api/testmagicstep2';

  this.availableRules = {
    "parents_when_non_or_4_and_more_selected": 'Parents when non or 4 and more selected',
    "parent_when_one_selected": 'Parent when one selected',
    "parents_when_2_to_4_selected": 'Parents when 2 to 4 selected',
    "children_of_selected": 'Children of selected'
  };

  // Display Loading Morkup

  this._prepareContainer = function (rulesCount) {
    var maxLength = Math.max(this.suggestionItems.length, rulesCount);
    if(this.suggestionItems) {
      for(var i = 0; i < maxLength; i++) {
        if((i+1) > rulesCount) {
          this.suggestionItems.splice(i, 1);
        } else {
          this.suggestionItems[i] = ToolHelper.getLoadingSuggestionItemData();
        }
      }
    }
  };

  this._getRequestData = function (suggestionRules, modelMarkerState) {

    var requests = {};

    for(var keyRule in suggestionRules) {

      var readyTime,
          entityConcepts,
          suggestion = suggestionRules[keyRule],
          requestRule = {};

      // Check :: Time

      readyTime = suggestion.time.toString();

      requestRule['time'] = {};
      requestRule['time']['value'] = readyTime;
      requestRule['time']['start'] = readyTime;
      requestRule['time']['end'] = readyTime;


      // Check :: activeEntities :: Model => entities/select

      requestRule['entities'] = {};
      requestRule['entities']['select'] = [];

      if(suggestion['activeEntities']) {
        for(var i = 0; i < suggestion['activeEntities'].length; i += 1) {
          requestRule['entities']['select'].push({
            geo: suggestion['activeEntities'],
            trailStartTime: readyTime,
            labelOffset: [0,0]
          });
        }
      }


      // Check :: entities :: Model => entities/show/geo

      requestRule['entities']['show'] = {};

      if(suggestion['entities'].length) {
        requestRule['entities']['show']['geo']= suggestion['entities'];
      } else {
        requestRule['entities']['show']['geo'] = [];
      }

      // Check :: entityConcepts :: Model => entities/show/geo.cat

      entityConcepts = ToolVizabiExternal.convertFormatMismatchFrom(suggestion['entityConcepts']);

      if(entityConcepts.length) {
        requestRule['entities']['show']['geo.cat'] = entityConcepts;
      } else {
        requestRule['entities']['show']['geo.cat'] = ToolVizabiExternal.getDefaultEntityShowData();
      }

      // Merge Markers

      requestRule['marker'] = modelMarkerState;

      // Completed

      requests[keyRule] = {
        'state': requestRule
      };
    }

    return requests;
  };

  this._render = function(response, minModel, metaData) {

    if(response.data.error) {
      console.log("Responce Image::Success::Error");
      return false;
    }

    console.log("Responce Image::Success::Success");

    // Unset Restrictions

    ToolVizabiExternal.clearModelForLink(minModel);
    console.log("_render::",minModel);

    // Create New Layout Item

    var suggestionItem = {
      title: "Suggestion Ready!",
      subtitle: this.availableRules[metaData.ruleLabel],
      link: this.baseHref + metaData.chartType + "#" + URLON.stringify(minModel),
      image: "data:image/png;base64," + response.data
    };

    // Update Layout

    this.suggestionItems[metaData.ruleIndex] = suggestionItem;
  };

  this._processRequest = function (minModel, metaData) {

    var requestData = {
      hash: URLON.stringify(minModel),
      chartType: metaData.chartType
    };

    // Take Snapshot

    $http.post(this.serviceUrl, requestData).then(function (response) {
      console.log("Responce Image::Success");
      this._render(response, minModel, metaData);
    }.bind(this), function (response) {
      console.log("Responce Image::Error", response);
    }.bind(this));
  };

  this.takeSnapshots = function (suggestions, chartType, modelMarkerState) {

    if (!_.isEmpty(suggestions.data)) {

      var ruleIndex = 0;
      var suggestionRules = suggestions.data.data;
      var rulesCount = _.keys(suggestionRules).length;

      var requests = this._getRequestData(suggestionRules, modelMarkerState);
      console.log("takeSnapshots::requests", requests);

      this._prepareContainer(rulesCount);

      for (var rule in requests) {

        this._processRequest(requests[rule], {
          ruleLabel: rule,
          ruleIndex: ruleIndex,
          chartType: chartType
        });

        ruleIndex++;
      }
    }
  };

  return this;
};

module.exports = ServiceSnapshot;
