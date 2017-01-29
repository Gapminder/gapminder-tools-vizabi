'use strict';

var Urlon = require('urlon');
var Vizabi = require('vizabi');
var FlashDetect = require('./flash-detect');
var _ = require('lodash');

var BITLY_SHORTENER_URL = 'https://api-ssl.bitly.com/v3/shorten';

module.exports = function (app) {
  app
    .controller('gapminderToolsCtrl', [
      '$scope', '$route', '$routeParams', '$location', 'vizabiItems', 'vizabiFactory', '$window',
      function ($scope, $route, $routeParams, $location, vizabiItems, vizabiFactory, $window) {
        // definition
        $scope.navCollapsed = false;
        $scope.loadingError = false;
        $scope.tools = {};
        $scope.validTools = [];
        $scope.relatedItems = [];
        $scope.availableCharts = ['bubbles', 'mountain', 'map', 'barrank', 'linechart'];
        $scope.vizabiInstances = {};
        $scope.vizabiModel = {};
        $scope.vizabiTools = {};

        $scope.locales = [
          {key: 'en', text: 'English'},
          {key: 'ar-SA', text: 'العربية'}
          //{key: 'sv', text: 'Svenska'},
          //{key: 'ru', text: 'Русский'},
          //{key: 'fr-FR', text: 'Français'},
          //{key: 'zh-CN', text: '中國傳統的'},
          //{key: 'es-ES', text: 'Español'}
        ];

        $scope.localeState = false;
        $scope.locale = detectLocale();
        $scope.localeList = $scope.locales.filter(function (f) {
          return f.key !== $scope.locale.key;
        });

        var updateFlagModel = false;
        var updateFlagUrl = false;

        // backward compatibility :: start

        var locationPath = $location.path() || '';
        var locationHash = $location.hash() || '';
        var REQUIRED_PARAM = 'chart-type';

        var deprecatedQueryPaths = $scope.availableCharts;
        var deprecatedQueryPathParts = locationPath.split('/');
        var deprecatedQueryDetected = deprecatedQueryPathParts.length >= 2 &&
          deprecatedQueryPaths.indexOf(deprecatedQueryPathParts[1]) !== -1;
        var shouldNavigateToHome = locationHash.indexOf(REQUIRED_PARAM) === -1;

        if (deprecatedQueryDetected) {
          var deprecatedQueryChart = deprecatedQueryPathParts[1];
          var urlModel = getModelFromUrl(locationHash);
          urlModel['chart-type'] = deprecatedQueryChart;
          var urlModelUpdated = Urlon.stringify(urlModel);
          var deprecatedQueryRedirect = '/#' + replaceSymbolByWord(urlModelUpdated);
          //$location.url(deprecatedQueryRedirect);
          $location.url(deprecatedQueryRedirect);
          //return window.location = deprecatedQueryRedirect;
        }

        if (shouldNavigateToHome && !deprecatedQueryDetected) {
          // invalid URL, redirect to Home
          $location.url(HOME_URL);
          //return window.location = HOME_URL;
        }

        // backward compatibility :: end

        // preload items

        vizabiItems.getItems().then(function (items) {
          $scope.tools = items;

          $scope.validTools = Object.keys($scope.tools);

          // load vizabi chart if type is Ok
          if (isChartTypeValid()) {
            updateGraph();
          } else {
            // invalid URL, redirect to Home
            window.location = '/tools' + HOME_URL;
            window.location.reload();
          }
        });

        // setup scope and handlers

        controllerImplementation();

        $scope.$root.$on('onModelChanged', function (e, data) {
          // skip flow for update from url
          if (updateFlagUrl) {
            updateFlagUrl = false;
            return;
          }

          // set incoming update type
          updateFlagModel = true;

          // update state in url
          window.location.hash = replaceSymbolByWord(data.hash);
        });

        // change hash handler

        $scope.$root.$on('$locationChangeSuccess', function (event, urlCurrent, urlPrevious) {
          if (!_.includes(urlCurrent, '/tools')) {
            return;
          }

          // set incoming update type
          updateFlagUrl = updateFlagModel ? updateFlagUrl : true;

          if (updateFlagUrl) {
            $scope.locale = detectLocale();
          }
          _updateChart(urlCurrent, urlPrevious);
        });

        // additional

        function updateGraph() {
          scrollTo(document.querySelector('.wrapper'), 0, 200, function () {
            var chartType = getChartType();
            if (!chartType) {
              return;
            }

            $scope.activeTool = chartType;

            // hide all
            $scope.availableCharts.forEach(function (item) {
              document.getElementById('vizabi-placeholder-' + item).style.display = 'none';
            });

            // show current
            var placeholder = document.getElementById('vizabi-placeholder-' + $scope.chartType);
            placeholder.style.display = 'block';

            updateVizabiInstance(placeholder);

            $scope.relatedItems = $scope.vizabiTools[$scope.chartType].relateditems;
            $scope.$apply();

            // send to google analytics
            $window.ga('send', 'pageview', {page: $location.url()});
          });
        }

        function updateVizabiInstance(placeholder) {
          var chartType = getChartType();

          // create instance if not exists
          if ($scope.vizabiInstances[chartType]) {
            if (!updateFlagModel) {
              var urlVizabiModel = getModelFromUrl($location.hash());
              var updatedModel = {};

              Vizabi.utils.deepExtend(updatedModel, $scope.vizabiModel[chartType], urlVizabiModel);
              $scope.vizabiInstances[chartType].instance.setModel(updatedModel);
            }
          } else {
            $scope.vizabiTools[chartType] = angular.copy($scope.tools[$scope.activeTool]);
            // setup locale
            $scope.vizabiTools[chartType].opts.locale = {
              id: $scope.locale.key,
              filePath: '/tools/public/translation/'
            };

            // create new instance
            $scope.vizabiInstances[chartType] = vizabiFactory.render(
              $scope.vizabiTools[chartType].tool,
              placeholder,
              $scope.vizabiTools[chartType].opts);

            // store base default model, only first time
            if (!$scope.vizabiModel[chartType]) {
              $scope.vizabiModel[chartType] = $scope.vizabiInstances[chartType].instance.getModel();
            }
          }
          updateFlagModel = false;
        }

        // internal

        function _updateChart(urlCurrent, urlPrevious) {
          // invalid URL, redirect to Home
          if (!isChartTypeValid()) {
            if (isChartTypesLoaded()) {
              window.location = '/tools' + HOME_URL;
              window.location.reload();
            }
            updateFlagUrl = false;
            updateFlagModel = false;
            return;
          }

          // detect chart switching
          const chartCurrent = getChartType(urlCurrent);
          const chartPrev = getChartType(urlPrevious);

          if (chartCurrent !== chartPrev) {
            vizabiFactory.unbindModelChange($scope.vizabiInstances[chartPrev].instance.model);
            delete $scope.vizabiInstances[chartPrev];
          }

          updateGraph();
        }

        function getChartType(urlParam) {
          var url = urlParam ? urlParam.split('/#')[1] : false;
          var hash = url ? url : $location.hash();
          if (hash) {
            var model = getModelFromUrl(hash);
            $scope.chartType = model['chart-type'] || false;
          } else {
            $scope.chartType = false;
          }

          return $scope.chartType;
        }

        function getModelFromUrl(hashParam) {
          var hash = replaceWordBySymbol(hashParam);
          if (hash) {
            return Urlon.parse(hash);
          }
          return {};
        }

        function isChartTypesLoaded() {
          return !!$scope.validTools.length;
        }

        function isChartTypeValid(chartTypeParam) {
          var chartType = chartTypeParam || getChartType();
          if (!chartType || !isChartTypesLoaded()) {
            return false;
          }
          return $scope.validTools.indexOf(chartType) !== -1;
        }

        function makeParamsForUrlShortening() {
          return {
            access_token: 'c5c5bdef4905a307a3a64664b1d06add09c48eb8',
            longUrl: encodeURIComponent(document.URL)
          };
        }

        function replaceSymbolByWord(inputString) {
          return inputString.replace(/\//g, '_slash_').replace(/%2F/g, '_slash_');
        }

        function replaceWordBySymbol(inputString) {
          return inputString.replace(/_slash_/g, '/').replace(/%2F/g, '/');
        }

        function detectLocale() {
          var foundLang = false;

          const modelFromUrl = getModelFromUrl($location.hash());
          const readyLang = _.first($scope.locales);

          if (modelFromUrl.locale) {
            foundLang = _.find($scope.locales, function (localeItem) {
              return localeItem.key === modelFromUrl.locale.id;
            });
          }

          const browserLang = getBrowserLang();
          if (!foundLang && browserLang) {
            foundLang = _.find($scope.locales, function (localeItem) {
              return localeItem.key === browserLang;
            });
          }

          // detected or default
          return foundLang ? foundLang : readyLang;
        }

        function getJSON(url, param, callback, err) {
          var request = new XMLHttpRequest();
          var pars = [];
          for (var i in param) {
            if (param.hasOwnProperty(i)) {
              pars.push(i + '=' + param[i]);
            }
          }
          request.open('GET', url + '?' + pars.join('&'), true);
          request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
              var data = JSON.parse(request.responseText);
              if (callback) {
                callback(data);
              }
            } else if (err) {
              err();
            }
          };
          request.onerror = function () {
            if (err) {
              err();
            }
          };
          request.send();
        }

        function scrollTo(element, to, duration, cb) {
          if (duration < 0) {
            return;
          }
          var difference = to - element.scrollTop;
          var perTick = difference / duration * 10;

          setTimeout(function () {
            element.scrollTop += perTick;
            if (element.scrollTop === to) {
              cb();
              return;
            }
            scrollTo(element, to, duration - 10, cb);
          }, 10);
        }

        // business logic

        function controllerImplementation() {
          $scope.embedVizabi = $location.search().embedded === 'true';

          $scope.embedded = function () {
            $location.search('embedded', 'true');
            prompt('Copy link', $location.absUrl());
            $location.search('embedded', null);
          };

          setUpSocialLinkHandlers();

          // BITLY
          $scope.shareLink = function () {
            var params = makeParamsForUrlShortening();

            getJSON(BITLY_SHORTENER_URL, params, function (response) {
              if (response.status_code === 200) {
                prompt('Copy the following link: ', response.data.url);
              } else {
                prompt('Copy the following link: ', window.location);
              }
            });
          };

          $scope.isFlashAvailable = function () {
            return FlashDetect.installed;
          };
        }

        function setUpSocialLinkHandlers() {
          /* eslint-disable max-len */
          var socialClassToUrl = {
            twitter: 'https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Fwww.gapminder.org&amp;related=Gapminder&amp;text=Gapminder&amp;tw_p=tweetbutton&amp;url=',
            facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
            mail: 'mailto:?subject=Gapminder&body='
          };
          /* eslint-enable max-len */

          var socialLinksSelector = Object.keys(socialClassToUrl)
            .filter(function (className) {
              return className !== 'mail'
            })
            .map(function (className) {
              return '.' + className;
            }).join(', ');

          _.toArray(document.querySelectorAll(socialLinksSelector)).forEach(function (socialLink) {
            socialLink.addEventListener('click', function (event) {
              event.preventDefault();

              var shareLinkWindow = window.open('');
              var params = makeParamsForUrlShortening();
              getJSON(BITLY_SHORTENER_URL, params, function (response) {
                var shortenedUrl = null;

                if (response.status_code === 200) {
                  shortenedUrl = response.data.url;
                } else {
                  shortenedUrl = window.location;
                }

                var selectedClassName = _.find(socialLink.classList, function (className) {
                  return socialClassToUrl[className];
                });

                shareLinkWindow.location.href = socialClassToUrl[selectedClassName] + shortenedUrl;
              });
            });
          });
        }

        $scope.changeLocale = function (localeItem) {
          $scope.locale = localeItem;
          $scope.localeState = false;
          $scope.navCollapsed = false;

          $scope.localeList = $scope.locales.filter(function (f) {
            return f.key !== $scope.locale.key;
          });

          var chartType = getChartType();
          var urlVizabiModel = getModelFromUrl($location.hash());
          var localeModel = {locale: {id: $scope.locale.key}};
          var updatedModel = {};

          Vizabi.utils.deepExtend(updatedModel, $scope.vizabiModel[chartType], urlVizabiModel, localeModel);
          setTimeout(function () {
            $scope.vizabiInstances[chartType].instance.setModel(updatedModel);
          }, 100);
        };

        $scope.getPageClass = function () {
          return $scope.locale ? 'page-lang-' + $scope.locale.key : '';
        };

        function getBrowserLang() {
          if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
            return false;
          }

          var browserLang = window.navigator.languages ? window.navigator.languages[0] : null;

          browserLang = browserLang ||
            window.navigator.language ||
            window.navigator.browserLanguage ||
            window.navigator.userLanguage;

          if (browserLang.indexOf('-') !== -1) {
            browserLang = browserLang.split('-')[0];
          }

          if (browserLang.indexOf('_') !== -1) {
            browserLang = browserLang.split('_')[0];
          }

          return browserLang;
        }

        $scope.documentClickHandler = function ($event) {
          const element = $event.target;

          const elemLangMobile = document.getElementsByClassName('locale-wrapper mobile')[0];
          const elemLangMobileVisible = elemLangMobile && window.getComputedStyle(elemLangMobile).display !== 'none';

          const elemLangDesktop = document.getElementsByClassName('locale-wrapper desktop')[0];
          //const elemLangDesktopVisible = elemLangDesktop && window.getComputedStyle(elemLangDesktop).display!='none';

          const elemLangActive = elemLangMobileVisible ? elemLangMobile : elemLangDesktop;

          if (!elemLangActive.contains(element)) {
            $scope.localeState = false;
          }
        };
      }]);
};
