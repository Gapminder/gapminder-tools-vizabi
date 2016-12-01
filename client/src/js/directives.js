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

        controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
          const languageItem = {
            menu_label: 'Language',
            children: []
          };

          $scope.$parent.localeList.forEach(function (item) {
            languageItem.children.push({
              menu_label: item.text,
              handler: $scope.$parent.changeLocale.bind(null, item)
            });
          });

          $scope.items = menuFactory.getMenu(languageItem);

          /**
           * Checks if a menu item has an icon.
           * @param {Object} item Icon
           * @returns {boolean} true if Icon exists
           */
          $scope.hasIcon = function (item) {
            return angular.isDefined(item) && item.icon_url;
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

          $scope.defaultHandler = function ($event, handler) {
            if (!handler) {
              return true;
            }

            $event.preventDefault();
            handler();

            $rootScope.$broadcast('hideMobileMenu');
            return false;
          };
        }],

        template: require('./menu.html')
      };
    }]);
};
