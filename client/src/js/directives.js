'use strict';

module.exports = function (app) {
  var bases = document.getElementsByTagName('base');
  var baseHref = null;
  if (bases.length > 0) {
    baseHref = bases[0].href;
  }

  var ASSET_URL = baseHref + 'public';

  app
    .directive('navExpandable', ['menuFactory', function (menuFactory) {
      return {
        restrict: 'A',
        scope: {
          items: '='
        },

        controller: ['$scope', function ($scope) {
          $scope.items = menuFactory.getMenu();

          /**
           * Checks if a menu item has an icon.
           * @param {Object} item Icon
           * @returns {boolean} true if Icon exists
           */
          $scope.hasIcon = function (item) {
            return angular.isDefined(item) && item;
          };

          /**
           * Creates an icon URL.
           * @param {string} url relative URL to icon
           * @returns {string} Icon Url to Assets
           */
          $scope.createIconUrl = function (url) {
            return ASSET_URL + url;
          };

          $scope.toggleSubmenu = [];
          $scope.showSubmenu = function (index) {
            for (var i = 0; i < $scope.toggleSubmenu.length; i++) {
              if (i !== index) {
                $scope.toggleSubmenu[i] = false;
              }
            }
            $scope.toggleSubmenu[index] = !$scope.toggleSubmenu[index];
          };
        }],

        template: require('./menu.html')
      };
    }]);
};
