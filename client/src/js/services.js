var d3 = require('d3');
var Vizabi = require('vizabi');
var urlon = require('URLON');
var Promise = require('bluebird');

module.exports = function (app) {
  var bases = document.getElementsByTagName('base');
  var baseHref = null;
  if (bases.length > 0) {
    baseHref = bases[0].href;
  }

  app
    .factory('vizabiFactory', [
      function () {
        return {
          /**
           * Render Vizabi
           * @param {String} tool name of the tool
           * @param {DOMElement} placeholder placeholder
           * @param {Object} model model
           * @return {Object} Vizabi
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
    .factory('vizabiItems', [function () {

      return {
        /**
         * Get All Items
         * @returns {Object} related items
         */
        getItems: function () {
          //return the promise directly.
          return Promise.resolve(require('../config/related-items.json'))
            .then(function (result) {
              var items = {}, i, s;
              for (i = 0, s = result.length; i < s; i++) {
                result[i].opts.data.path = WS_SERVER + result[i].opts.data.path;
                items[result[i].slug] = result[i];
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
          /**
           * Get All Items
           * @returns {Object} menu items
           */
          getMenu: function () {
            return require('../config/menu-items.json').children;
          },

          /**
           * Returns the current URL.
           * @returns {string} current URL
           */
          getCurrentUrl: function () {
            return $location.$$path;
          }
        };
      }]);
};
