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
            var hash = $location.hash() || '';
            var vizabiObj = {instance: null};

            if (hash) {
              var urlSafe = replaceWordBySymbol(hash);
              var urlModel = urlon.parse(urlSafe);
              Vizabi.utils.deepExtend(model, urlModel);
            }

            this.bindModelChange(model, vizabiObj);
            vizabiObj.instance = Vizabi(tool, placeholder, model);

            return vizabiObj;
          },

          bindModelChange: function (model, vizabiObj) {
            var that = this;
            var initialModel = Vizabi.utils.deepClone(model);

            model.bind = model.bind || {};

            model.bind.ready = function () {
              var minModelDiff = vizabiObj.instance.getPersistentMinimalModel(initialModel);
              // fix url state
              minModelDiff['chart-type'] = initialModel['chart-type'];
              var modelDiffHash = urlon.stringify(minModelDiff);
              updateModelDebounced(modelDiffHash, that.emit);
            };

            model.bind.persistentChange = function () {
              var minModelDiff = vizabiObj.instance.getPersistentMinimalModel(initialModel);
              // fix url state
              minModelDiff['chart-type'] = initialModel['chart-type'];
              var modelDiffHash = urlon.stringify(minModelDiff);
              updateModelDebounced(modelDiffHash, that.emit);
            };
          },

          unbindModelChange: function (model) {
            model.off('persistentChange');
            model.off('ready');
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
           * @param {Object} additional extra item
           * @returns {Object} menu items
           */
          getMenu: function (additional) {
            const menuItems = require('../config/menu-items.json').children;
            const menuItemsClone = _.cloneDeep(menuItems);
            menuItemsClone.unshift(additional);
            return menuItemsClone;
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
