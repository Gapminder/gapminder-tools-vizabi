module.exports = function (app) {
  app
    .service("ToolVizabiExternal", [function () {


      /* ToolVizabiExternal :: Constants */

      var MAPPING_CHART_TYPES,
          MAPPING_CHART_MEASURES,
          DEFAULT_MODEL_STATE;


      /* ToolVizabiExternal :: API */

      this.getChartType = function (tool, def) {
        return MAPPING_CHART_TYPES[tool] ? MAPPING_CHART_TYPES[tool] : def;
      };

      this.getChartMeasures = function (chartType) {
        return MAPPING_CHART_MEASURES[chartType];
      };

      this.searchData = function(path, masterModel, SlaveModel) {
        var dataSlave,
            dataMaster;

        dataMaster = this._searchData(path, masterModel);
        if(typeof dataMaster != 'undefined') {
          return dataMaster;
        }

        dataSlave = this._searchData(path, SlaveModel);
        return dataSlave;
      };

      this.searchDataTime = function (path, masterModel, SlaveModel) {
        var dataSlave,
            dataMaster;

        dataMaster = this._searchData(path, masterModel);
        if(typeof dataMaster != 'undefined') {
          return dataMaster;
        }

        dataSlave = this._searchData(path, SlaveModel);
        return new Date(dataSlave).getUTCFullYear().toString();
      };

      this.searchDataEntities = function (path, masterModel, SlaveModel, filterKey) {
        var index,
            dataModel,
            result = [];

        dataModel = this._searchData(path, masterModel);
        if(typeof dataModel == 'undefined') {
          dataModel = this._searchData(path, SlaveModel);
        }

        if(!dataModel) {
          return result;
        }

        for(index = 0; index < dataModel.length; index += 1) {
          result.push(dataModel[index][filterKey]);
        }
        return result;
      };

      this.setDefaultStructure = function (path, minModel, BaseModel) {
        var targetObj = {};
        targetObj['which'] = this.searchData('state/marker/'+path+'/which', minModel, BaseModel);
        targetObj['use'] = this.searchData('state/marker/'+path+'/use', minModel, BaseModel);
        return targetObj;
      };

      this._searchData = function(path, model) {
        var mainPath,
            pathPart,
            pathPartLength;

        pathPart = path.split("/");
        pathPartLength = pathPart.length;

        // last
        if(pathPartLength == 1) {
          return model[path];
        } else {
          mainPath = pathPart.shift();
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
        return DEFAULT_MODEL_STATE.entities.show['geo.cat'];
      };

      this.clearModelForLink = function (minModel) {
        // restriction Time
        delete minModel.state.time.end;
        delete minModel.state.time.start;
      };

      this.setupInitState = function(items) {
        var defaultModelStateMap,
            defaultModelStateBubble,
            defaultModelStateMountain;

        // setup Map Chart Model

        defaultModelStateMap = angular.copy(DEFAULT_MODEL_STATE);
        items.map.opts.state = defaultModelStateMap;

        // setup Bubble Chart Model

        defaultModelStateBubble = angular.copy(DEFAULT_MODEL_STATE);
        defaultModelStateBubble.marker["axis_y"] = {
          "which": "life_expectancy"
        };
        items.bubbles.opts.state = defaultModelStateBubble;

        // setup Mountain Chart Model
        // Asked For Correct State (*)

        defaultModelStateMountain = angular.copy(DEFAULT_MODEL_STATE);
        /*
        defaultModelStateMountain.marker.group = {
          "merge" :true
        };
        */
        /*
        defaultModelStateMountain.marker["axis_y"] = {
          "which": "life_expectancy"
        };
        */
        items.mountain.opts.state = defaultModelStateMountain;
      };


      /* ToolVizabiExternal :: Constants :: Definition */

      MAPPING_CHART_TYPES = {
        'BubbleChart': "bubbles",
        'MountainChart': "mountain",
        'BubbleMap': "map",
        'BarChart': "bar",
        'BarRankChart': "barrank",
        'LineChart': "line",
        'PopByAge': "pop"
      };

      MAPPING_CHART_MEASURES = {
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

      DEFAULT_MODEL_STATE = {
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
    }]);
};
