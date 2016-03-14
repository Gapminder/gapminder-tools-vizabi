var d3 = require('d3');
var Vizabi = require('vizabi');
var urlon = require('URLON');

module.exports = function (app) {
  var bases = document.getElementsByTagName('base');
  var baseHref = null;
  if (bases.length > 0) {
    baseHref = bases[0].href;
  }

  app
    .factory("vizabiFactory", [
      function () {
        return {
          /**
           * Render Vizabi
           * @param {String} tool name of the tool
           * @param {DOMElement} placeholder
           * @return {Object}
           */
          render: function (tool, placeholder, model) {
            var loc = window.location.toString();
            var hash = null;
            var initialModel = Vizabi.utils.deepClone(model);

            if (loc.indexOf('#') >= 0) {
              hash = loc.substring(loc.indexOf('#') + 1);
            }

            if (hash) {
              var str = encodeURI(decodeURIComponent(hash));
              var urlModel = urlon.parse(str);
              Vizabi.utils.deepExtend(model, urlModel);
            }

            model.bind = model.bind || {};
            model.bind.persistentChange = onPersistentChange;

            function onPersistentChange(evt, minModel) {
              minModel = Vizabi.utils.diffObject(minModel, initialModel);
              window.location.hash = urlon.stringify(minModel);
            }

            return Vizabi(tool, placeholder, model);
          }
        };
      }]);


  app
    .factory("vizabiItems", ['$http', function ($http) {

      return {
        /**
         * Get All Items
         */
        getItems: function () {
          //return the promise directly.
          return $http.get(WS_SERVER + '/api/vizabi/gapminder_tools/related_items/')
            .then(function (result) {
              var items = {}, i, s;
              for (i = 0, s = result.data.length; i < s; i++) {
                items[result.data[i].slug] = result.data[i];
              }
              return items;
            });
        }
      };

    }]);

  app
    .factory('menuFactory', [
      '$location', '$q', '$http',
      function ($location, $q, $http) {

        return {
          cached: [],
          /**
           * Get All Items
           */
          getMenu: function () {
            //return the promise directly.
            var _this = this;
            return $http.get(WS_SERVER + '/api/vizabi/gapminder_tools/menu_items/')

              .then(function (result) {
                if (result.status === 200) {
                  _this.cached = result.data.children;
                }
                return _this.getCachedMenu();
              });
          },

          /**
           * Returns the home tree data.
           * @returns {}
           */
          getCachedMenu: function () {
            return this.cached;
          },

          /**
           * Returns the current URL.
           * @returns {string}
           */
          getCurrentUrl: function () {
            return $location.$$path;
          }
        };
      }]);
};
