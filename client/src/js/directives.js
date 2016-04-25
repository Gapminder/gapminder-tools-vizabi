'use strict';

const templateMenu = require('./menu.html');

module.exports = function directives(app) {
  const bases = document.getElementsByTagName('base');
  const mainPass = 'public';
  let baseHref = null;
  let ASSET_URL = null;


  if (bases.length > 0) {
    baseHref = bases[0].href;
  }
  ASSET_URL = baseHref + mainPass;

  app
    .directive('navExpandable', ['menuFactory', function navExpandable(menuFactory) {
      return {
        restrict: 'A',
        scope: {
          items: '='
        },

        controller: ['$scope', function controller($scope) {
          $scope.items = menuFactory.getMenu();

          /**
           * Checks if a menu item has an icon.
           * @param {Object} item Icon
           * @returns {boolean} true if Icon exists
           */
          $scope.hasIcon = function hasIcon(item) {
            return angular.isDefined(item) && item;
          };

          /**
           * Creates an icon URL.
           * @param {string} url relative URL to icon
           * @returns {string} Icon Url to Assets
           */
          $scope.createIconUrl = function createIconUrl(url) {
            return ASSET_URL + url;
          };

          $scope.toggleSubmenu = [];
          $scope.showSubmenu = function showSubmenu(indexCheck) {
            let index = 0;

            for (; index < $scope.toggleSubmenu.length; index++) {
              if (index !== indexCheck) {
                $scope.toggleSubmenu[index] = false;
              }
            }
            $scope.toggleSubmenu[indexCheck] = !$scope.toggleSubmenu[indexCheck];
          };
        }],

        template: templateMenu
      };
    }]);
};
