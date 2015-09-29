Vizabi._globals.gapminder_paths.baseUrl = "http://static.gapminderdev.org/vizabi/master/preview/";

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
 * Waffle server Reader
 * the simplest reader possible
 */

(function () {

  "use strict";

  var Vizabi = this.Vizabi;
  var utils = Vizabi.utils;
  var Promise = Vizabi.Promise;

  Vizabi.Reader.extend('waffle-server', {

    basepath: "",

    /**
     * Initializes the reader.
     * @param {Object} reader_info Information about the reader
     */
    init: function (reader_info) {
      this._name = 'ws-reader';
      this._data = [];
      this._formatters = reader_info.formatters;
      this._basepath = reader_info.path || this.basepath;
      if (!this._basepath) {
        utils.error("Missing base path for waffle-server reader");
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
      var formatted;

      this._data = [];

      (function (query, p) {

        var where = query.where;

        //format time query if existing
        if (where['time']) {
          //[['1990', '2012']] -> '1990-2012'
          where['time'] = where['time'][0].join('-');
        }

        //rename geo.category to geo.cat
        if (where['geo.category']) {
          where['geo.cat'] = utils.clone(where['geo.category']);
          where['geo.category'] = void 0;
        }

        formatted = {
          "SELECT": query.select,
          "WHERE": where,
          "FROM": "spreedsheet"
        };

        var pars = {
          query: [formatted],
          lang: language
        };

        //request data
        utils.post(_this._basepath, JSON.stringify(pars), function (res) {
          //fix response
          res = format(res[0]);
          //parse and save
          parse(res);

        }, function () {
          console.log("Error loading from Waffle Server:", _this._basepath);
          p.reject('Could not read from waffle server');
        }, true);

        function format(res) {
          //make category an array and fix missing regions
          res = res.map(function (row) {
            row['geo.cat'] = [row['geo.cat']];
            row['geo.region'] = row['geo.region'] || row['geo'];
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
          //just check for length, no need to parse from server
          if(res.length==0) utils.warn("data reader returns empty array, that's bad");
          _this._data = res;
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
