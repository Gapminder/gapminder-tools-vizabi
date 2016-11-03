'use strict';

var _ = require('lodash');
var Vizabi = require('vizabi');
var urlon = require('urlon');
var Promise = require('bluebird');

var updateModelDebounced = _.debounce(function updateModel(newModelHash, callback) {
  if (window.location.hash !== newModelHash) {
    callback({hash: newModelHash});
  }
});

function replaceWordBySymbol(inputString) {
  return inputString.replace(/_slash_/g, '/').replace(/%2F/g, '/');
}

module.exports = function (app) {
  app
    .factory('vizabiFactory', ['$rootScope', '$location',
      function ($rootScope, $location) {
        return {
          emit: function (data) {
            $rootScope.$broadcast('onModelChanged', data);
          },

          /**
           * Render Vizabi
           * @param {String} tool name of the tool
           * @param {DOMElement} placeholder placeholder
           * @param {Object} model model
           * @return {Object} Vizabi
           */
          render: function (tool, placeholder, model) {
            var that = this;
            var vizabiInstance = {};
            var hash = $location.hash() || '';
            var initialModel = Vizabi.utils.deepClone(model);

            if (hash) {
              var urlSafe = replaceWordBySymbol(hash);
              var urlModel = urlon.parse(urlSafe);
              Vizabi.utils.deepExtend(model, urlModel);
            }

            model.bind = model.bind || {};
            model.bind.ready = function () {
              var minModelDiff = vizabiInstance.getPersistentMinimalModel(initialModel);
              var modelDiffHash = urlon.stringify(minModelDiff);
              updateModelDebounced(modelDiffHash, that.emit);
            };
            
            model.bind.persistentChange = function () {
              var minModelDiff = vizabiInstance.getPersistentMinimalModel(initialModel);
              var modelDiffHash = urlon.stringify(minModelDiff);
              updateModelDebounced(modelDiffHash, that.emit);
            };

            vizabiInstance = Vizabi(tool, placeholder, model);
            return vizabiInstance;
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
          // return the promise directly.
          return Promise.resolve(require('../config/related-items.json'))
            .then(function (result) {
              var s = result.length;
              var items = {};
              for (var i = 0; i < s; i++) {
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
      '$location',
      function ($location) {
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
