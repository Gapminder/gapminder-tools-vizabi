'use strict';

const Vizabi = require('vizabi');
const urlon = require('URLON');
const Promise = require('bluebird');

const relatedJson = require('../config/related-items.json');
const menuItems = require('../config/menu-items.json');

module.exports = function services(app) {
  app
    .factory('vizabiFactory', [
      function vizabiFactory() {
        return {

          /**
           * Render Vizabi
           * @param {String} tool name of the tool
           * @param {DOMElement} placeholder placeholder
           * @param {Object} model model
           * @return {Object} Vizabi
           */
          render: function render(tool, placeholder, model) {
            const loc = window.location.toString();
            const initialModel = Vizabi.utils.deepClone(model);
            let hash = null;
            let str = null;
            let urlModel = null;

            if (loc.indexOf('#') >= 0) {
              hash = loc.substring(loc.indexOf('#') + 1);
            }

            if (hash) {
              str = encodeURI(decodeURIComponent(hash));
              urlModel = urlon.parse(str);
              Vizabi.utils.deepExtend(model, urlModel);
            }

            model.bind = model.bind || {};
            model.bind.persistentChange = onPersistentChange;

            function onPersistentChange(evt, minModel) {
              const minModelDiff = Vizabi.utils.diffObject(minModel, initialModel);

              window.location.hash = urlon.stringify(minModelDiff);
            }

            return Vizabi(tool, placeholder, model);
          }
        };
      }]);

  app
    .factory('vizabiItems', [function vizabiItems() {
      return {

        /**
         * Get All Items
         * @returns {Object} related items
         */
        getItems: function getItems() {
          // return the promise directly.
          return Promise.resolve(relatedJson)
            .then(result => {
              let index = 0;
              const resLength = result.length;
              const items = {};

              for (; index < resLength; index++) {
                result[index].opts.data.path = WS_SERVER + result[index].opts.data.path;
                items[result[index].slug] = result[index];
              }
              return items;
            });
        }
      };
    }]);

  app
    .factory('menuFactory', [
      '$location',
      function menuFactory($location) {
        return {

          /**
           * Get All Items
           * @returns {Object} menu items
           */
          getMenu: function getMenu() {
            return menuItems.children;
          },

          /**
           * Returns the current URL.
           * @returns {string} current URL
           */
          getCurrentUrl: function getCurrentUrl() {
            return $location.$$path;
          }
        };
      }]);
};
