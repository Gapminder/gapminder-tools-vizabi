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

  return this;
};

module.exports = ToolVizabiExternal();
