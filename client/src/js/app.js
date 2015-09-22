Vizabi._globals.gapminder_paths.baseUrl = "http://static.gapminderdev.org/vizabi/develop/preview/";

//main app module

angular.module('gapminderTools', ['ngRoute']).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

  $routeProvider
    .when('/:slug', {
      controller: 'gapminderToolsCtrl'
    })
    .otherwise({
      redirectTo: '/bubbles'
    });

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
}]);

//TODO: remove global

function forceResizeEvt() {
  //force resize
  event = document.createEvent("HTMLEvents");
  event.initEvent("resize", true, true);
  event.eventName = "resize";
  window.dispatchEvent(event);
}

/*!
 * Local JSON reader
 */

(function () {

  "use strict";

  var root = this;
  var Vizabi = root.Vizabi;
  var utils = Vizabi.utils;
  var Promise = Vizabi.Promise;

  var FILE_CACHED = {}; //caches files from this reader
  var FILE_REQUESTED = {}; //caches files from this reader

  Vizabi.Reader.extend('ws-json', {

    /**
     * Initializes the reader.
     * @param {Object} reader_info Information about the reader
     */
    init: function (reader_info) {
      this._name = 'json';
      this._json = reader_info.data;
      this._data = [];
      this._basepath = reader_info.path;
      this._formatters = reader_info.formatters;
      if (!this._basepath) {
        utils.error("Missing base path for ws-json reader");
      }
    },

    /**
     * Reads from source
     * @param {Object} query to be performed
     * @param {String} language language
     * @returns a promise that will be resolved when data is read
     */
    read: function (query, language) {
      var _this = this;
      var p = new Promise();
      var path = this._basepath;
      //this specific reader has support for the tag {{LANGUAGE}}
      //var path = this._basepath.replace("{{LANGUAGE}}", language);

      //replace conditional tags {{<any conditional>}}
      //path = path.replace(/{{(.*?)}}/g, function(match, capture){
      //  capture = capture.toLowerCase();
      //  if(utils.isArray(query.where[capture])) {
      //    return query.where[capture].sort().join('-');
      //  }
      //  return query.where[capture];
      //});

      _this._data = [];

      (function (query, p) {
        console.log(query.select);
        //if cached, retrieve and parse
        if (FILE_CACHED.hasOwnProperty(path)) {
          parse(FILE_CACHED[path]);
        }
        //if requested by another hook, wait for the response
        else if (FILE_REQUESTED.hasOwnProperty(path)) {
          FILE_REQUESTED[path].then(function () {
            parse(FILE_CACHED[path]);
          });
        }
        //if not, request and parse
        else {
          //d3.csv(path, function (error, res) {
          FILE_REQUESTED[path] = new Promise();
          var res = _this._json;

          if (!res) {
            utils.error("Empty json: " + path, error);
            return;
          }

          //fix CSV response
          res = format(res);

          //cache and resolve
          FILE_CACHED[path] = res;
          FILE_REQUESTED[path].resolve();
          delete FILE_REQUESTED[path];

          parse(res);
          //});
        }

        function format(res) {
          //make category an array and fix missing regions
          res = res.map(function (row) {
            row['geo.cat'] = [row['geo.cat']];
            row['geo.region'] = row['geo.region'] || row.geo;
            return row;
          });

          //format data
          res = utils.mapRows(res, _this._formatters);

          //TODO: fix this hack with appropriate ORDER BY
          //order by formatted
          //sort records by time
          var keys = Object.keys(_this._formatters);
          var order_by = keys[0];
          res.sort(function (a, b) {
            return a[order_by] - b[order_by];
          });
          //end of hack

          return res;
        }

        function parse(res) {

          var data = res;
          //rename geo.category to geo.cat
          var where = query.where;
          if (where['geo.category']) {
            where['geo.cat'] = utils.clone(where['geo.category']);
            delete where['geo.category'];
          }

          //format values in the dataset and filters
          where = utils.mapRows([where], _this._formatters)[0];

          //make sure conditions don't contain invalid conditions
          var validConditions = [];
          utils.forEach(where, function (v, p) {
            for (var i = 0, s = data.length; i < s; i++) {
              if (data[i].hasOwnProperty(p)) {
                validConditions.push(p);
                return true;
              }
            }
          });
          //only use valid conditions
          where = utils.clone(where, validConditions);

          //filter any rows that match where condition
          data = utils.filterAny(data, where);

          //warn if filtering returns empty array
          if (data.length === 0) utils.warn("data reader returns empty array, that's bad");

          //only selected items get returned
          data = data.map(function (row) {
            return utils.clone(row, query.select);
          });
          //console.log(data);
          _this._data = data;
          p.resolve();
        }

      })(query, p);

      return p;
    },

    /**
     * Gets the data
     * @returns all data
     */
    getData: function () {
      return this._data;
    }
  });

}).call(this);
