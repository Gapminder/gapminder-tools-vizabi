var ToolVizabiExternal = function () {

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

  var defaultModelState = {
    "entities": {
      "show": {
        "geo.cat": [
          "global",
          "world_4region",
          "country",
          "un_state"
        ]
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

  this.getChartType = function (tool, def) {
    return mappingChartTypeList[tool] ? mappingChartTypeList[tool] : def;
  };

  this.getChartMeasures = function (chartType) {
    return mappingChartTypeMeasures[chartType];
  };

  this.searchData = function(path, masterModel, SlaveModel) {

    var dataMaster = this._searchData(path, masterModel);
    if(typeof dataMaster != 'undefined') {
      return dataMaster;
    }

    var dataSlave = this._searchData(path, SlaveModel);
    return dataSlave;
  };

  this.searchDataTime = function (path, masterModel, SlaveModel) {

    var dataMaster = this._searchData(path, masterModel);
    if(typeof dataMaster != 'undefined') {
      return dataMaster;
    }

    var dataSlave = this._searchData(path, SlaveModel);
    return new Date(dataSlave).getFullYear().toString();
  };

  this.searchDataEntities = function (path, masterModel, SlaveModel, filterKey) {

    var result = [];
    var dataModel = this._searchData(path, masterModel);
    if(typeof dataModel == 'undefined') {
      dataModel = this._searchData(path, SlaveModel);
    }

    if(!dataModel) {
      return result;
    }

    for(var index = 0; index < dataModel.length; index += 1) {
      result.push(dataModel[index][filterKey]);
    }
    return result;
  };

  this._searchData = function(path, model) {

    var pathPart = path.split("/");
    var pathPartLength = pathPart.length;

    // last
    if(pathPartLength == 1) {
      return model[path];
    } else {
      var mainPath = pathPart.shift();
      if(typeof model[mainPath] != 'undefined') {
        return this._searchData(pathPart.join("/"), model[mainPath]);
      } else {
        return;
      }
    }
  };

  this.convertFormatMismatchFrom = function(array) {
    return array.map(function(v) {
      return v === 'unstate' ? 'un_state' : v;
    });
  };

  this.convertFormatMismatchTo = function(array) {
    return array.map(function(v) {
      return v === 'un_state' ? 'unstate' : v;
    });
  };

  this.getDefaultEntityShowData = function () {
    return defaultModelState.entities.show['geo.cat'];
  };

  this.clearModelForLink = function (minModel) {

    // restriction Time
    delete minModel.state.time.end;
    delete minModel.state.time.start;

    // restriction Splash
    // delete minModel.data.splash;
  }

  this.setupInitState = function(items) {

    // setup Map Chart Model

    var defaultModelStateMap = angular.copy(defaultModelState);
    items.map.opts.state = defaultModelStateMap;

    // setup Bubble Chart Model

    var defaultModelStateBubble = angular.copy(defaultModelState);
    defaultModelStateBubble.marker["axis_y"] = {
      "which": "life_expectancy"
    };
    items.bubbles.opts.state = defaultModelStateBubble;

    // setup Mountain Chart Model
    // Asked For Correct State (*)

    var defaultModelStateMountain = angular.copy(defaultModelState);
    defaultModelStateMountain.marker["axis_y"] = {
      "which": "life_expectancy"
    };
    items.mountain.opts.state = defaultModelStateMountain;
  };

  return this;
};

module.exports = ToolVizabiExternal();
