var d3 = require('d3');
var Vizabi = require('vizabi');
var urlon = require('URLON');

module.exports = function (app) {
  var bases = document.getElementsByTagName('base');
  var baseHref = null;
  if (bases.length > 0) {
    baseHref = bases[0].href;
  }

  function formatDate(date, unit) {
    var timeFormats = {
      "year": d3.time.format("%Y"),
      "month": d3.time.format("%Y-%m"),
      "week": d3.time.format("%Y-W%W"),
      "day": d3.time.format("%Y-%m-%d"),
      "hour": d3.time.format("%Y-%m-%d %H"),
      "minute": d3.time.format("%Y-%m-%d %H:%M"),
      "second": d3.time.format("%Y-%m-%d %H:%M:%S")
    };
    return timeFormats[unit](date);
  }

  function formatDates(state) {
    // Format date objects according to the unit
    if(state && state.time) {
      var unit = state.time.unit || "year";
      if(typeof state.time.value === 'object') {
        state.time.value = formatDate(state.time.value, unit);
      }
      if(typeof state.time.start === 'object') {
        state.time.start = formatDate(state.time.start, unit);
      }
      if(typeof state.time.end === 'object') {
        state.time.end = formatDate(state.time.end, unit);
      }
    }
  }

  app
    .factory("vizabiFactory", ['config',
      function (config) {
        return {
          /**
           * Render Vizabi
           * @param {String} tool name of the tool
           * @param {DOMElement} placeholder
           * @return {Object}
           */
          render: function (tool, placeholder, options) {
            var loc = window.location.toString();
            var hash = null;
            console.log('loc:', loc);
            if (config.isChromeApp || config.isElectronApp) {
              var pos = -1;
              var  hashtagCount = 0;
              while ((pos = loc.indexOf('#', pos + 1)) !== -1) {
                hashtagCount++;
              }
              if (hashtagCount >= 2) {
                hash = loc.substring(loc.lastIndexOf('#') + 1);
              }
            } else {
              if (loc.indexOf('#') >= 0) {
                hash = loc.substring(loc.indexOf('#') + 1);
              }
            }

            if (hash) {
              console.log('hash:', hash);
              var str = encodeURI(decodeURIComponent(hash));
              console.log('str:', str);
              var state = urlon.parse(str);
              options.language = {};
              options.language.id = state.id || 'en';
              options.state = state;
            }

            options.bind = options.bind || {};
            options.bind.historyUpdate = onHistoryUpdate;
            function onHistoryUpdate(eventName, state) {
              if (config.isChromeApp) {
                return;
              }
              formatDates(state);
              window.location.hash = urlon.stringify(state);
              //if hash must be in chrome app - it should be done like this,
              //because window.location is unsupported in chrome app
              //$location.hash(urlon.stringify(state));
            }

            var fs = require('fs');
            var path = require('path');

            //path for packaged - resources/app
            var graphData = JSON.parse(fs.readFileSync(path.join(config.electronPath,'client/src/public/data/convertcsv.json'), 'utf8'));
            var geoData = JSON.parse(fs.readFileSync(path.join(config.electronPath, 'client/src/public/data/geo.json'), 'utf8'));
            var geoHash  = {};
            for (var j = 0; j < geoData.length; j++) {
              geoHash[geoData[j].geo]= geoData[j];
            }

            for (var i = 0; i < graphData.length; i++) {
              graphData[i].time = graphData[i].time + '';
              graphData[i]['geo.name'] = geoHash[graphData[i].geo]['geo.name']
              graphData[i]['geo.cat'] = geoHash[graphData[i].geo]['geo.cat']
              graphData[i]['geo.region'] = geoHash[graphData[i].geo]['geo.region']
            }

            options.data.data = graphData;
            options.data.reader = 'inline';
            delete options.data.path;
            //console.log(options);
            return Vizabi(tool, placeholder, options);
          }
        };
      }]);


  app
    .factory("vizabiItems", ['$http', 'config', function ($http, config) {

      return {
        /**
         * Get All Items
         */
        getItems: function () {
          var promiseCb =  function  (result) {
            var items = {}, i, s;
            for (i = 0, s = result.data.length; i < s; i++) {
              items[result.data[i].slug] = result.data[i];
            }
            return items;
          };

          if (config.isElectronApp) {
            var promise = new Promise(function(resolve) {
              var result = {
                data: itemXhrResult
              };
              resolve(result);
            });

            return promise.then(promiseCb);
          }

          //return the promise directly.
          return $http.get(config.apiUrl + '/item')
            .then(promiseCb);
        }
      };

    }]);

  app
    .factory('menuFactory', [
      '$location', '$q', '$http', 'config',
      function ($location, $q, $http, config) {

        return {
          cached: [],

          /**
           * Get All Items
           */
          getMenu: function () {
            //return the promise directly.
            var _this = this;
            //in chrome app we have to use full url, (or maybe use interceptor?)
            //also we can use some global var(defined by webpack), so if it is true - use full url( get it from manifest),
            //if not - use only path (e.g. /api/item)
            return $http.get(config.apiUrl + '/menu')
              .then(function (result) {
                console.log('/menu result');
                console.log(JSON.stringify(result.data));
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

//temp data for Electron app
var itemXhrResult = [
  {
    "_id":"55f70fd5dbbfabe3d6a2753f",
    "description":"This graph shows the amount of people in the world across each income level.",
    "opts":{
      "data":{
        "path":"//waffles.gapminderdev.org/api/graphs/stats/vizabi-tools",
        "reader":"graph"
      },
      "ui":{
        "buttons":[
          "find",
          "colors",
          "stack",
          "axesmc",
          "show",
          "fullscreen"
        ],
        "buttons_expand":[
          "colors",
          "find",
          "stack"
        ]
      }
    },
    "tool":"MountainChart",
    "slug":"mountain",
    "category":"Tools",
    //"image":"/tools/public/images/tools/mountainchart.png",
    "image":"public/images/tools/mountainchart.png",
    "title":"Mountain Chart",
    "relateditems":[
      {
        "_id":"5600af4a188967b26265a73f",
        "_relatedTo":[
          "55f70fd5dbbfabe3d6a2753f"
        ],
        "link":"http://www.gapminder.org/answers/how-many-are-rich-and-how-many-are-poor/",
        "image":"//cms.gapminder.org/files-api/p3media/file/image?id=399&preset=160x96&title=media&extension=.jpg",
        "subtitle":"Short answer — Most are in between",
        "title":"How many are rich and how many are poor?",
        "__v":0
      },
      {
        "_id":"560061d4fc0d7c00002110a4",
        "title":"How Reliable is the World Population Forecast?",
        "subtitle":"Short answer — Very reliable",
        "image":"//cms.gapminder.org/files-api/p3media/file/image?id=136&preset=160x96&title=media&extension=.jpg",
        "link":"http://www.gapminder.org/answers/how-reliable-is-the-world-population-forecast/",
        "_relatedTo":[
          "55f71e8ccdedc1ff074e9f6d",
          "55f70fd5dbbfabe3d6a2753f"
        ]
      },
      {
        "_id":"5600ad4c188967b26265a73b",
        "_relatedTo":[
          "55f71e8ccdedc1ff074e9f6d",
          "55f70fd5dbbfabe3d6a2753f"
        ],
        "link":"http://www.gapminder.org/answers/will-saving-poor-children-lead-to-overpopulation/",
        "image":"//cms.gapminder.org/files-api/p3media/file/image?id=409&preset=160x96&title=media&extension=.jpg",
        "subtitle":"Short answer — No. The opposite.",
        "title":"Will saving poor children lead to overpopulation?",
        "__v":0
      },
      {
        "_id":"5600ae2b188967b26265a73c",
        "_relatedTo":[
          "55f71e8ccdedc1ff074e9f6d",
          "55f70fd5dbbfabe3d6a2753f"
        ],
        "link":"http://www.gapminder.org/answers/how-does-income-relate-to-life-expectancy/",
        "image":"//cms.gapminder.org/files-api/p3media/file/image?id=318&preset=160x96&title=media&extension=.jpg",
        "subtitle":"Short answer — Rich people live longer",
        "title":" How Does Income Relate to Life Expectancy?",
        "__v":0
      },
      {
        "_id":"5600ae64188967b26265a73d",
        "_relatedTo":[
          "55f71e8ccdedc1ff074e9f6d",
          "55f70fd5dbbfabe3d6a2753f"
        ],
        "link":"http://www.gapminder.org/answers/how-did-babies-per-woman-change-in-the-world/",
        "image":"//cms.gapminder.org/files-api/p3media/file/image?id=125&preset=160x96&title=media&extension=.jpg",
        "subtitle":"Short answer — It dropped",
        "title":"How Did Babies per Woman Change in the World?",
        "__v":0
      },
      {
        "_id":"5600aedc188967b26265a73e",
        "_relatedTo":[
          "55f71e8ccdedc1ff074e9f6d",
          "55f70fd5dbbfabe3d6a2753f"
        ],
        "link":"http://www.gapminder.org/posters/gapminder-world-2013/",
        "image":"//cms.gapminder.org/files-api/p3media/file/image?id=209&preset=160x96&title=media&extension=.jpg",
        "subtitle":"This chart compares Life Expectancy & GDP per capita of 182 nations in 2013.",
        "title":"Gapminder World Poster 2013",
        "__v":0
      }
    ],
    "__v":5
  },
  {
    "_id":"55f71e8ccdedc1ff074e9f6d",
    "description":"This graph shows how long people live and how much money they earn. Click the play button to see how countries have developed since 1800.",
    "opts":{
      "data":{
        "path":"//waffles.gapminderdev.org/api/graphs/stats/vizabi-tools",
        "reader":"graph"
      },
      "ui":{
        "buttons":[
          "find",
          "axes",
          "size",
          "colors",
          "trails",
          "lock",
          "moreoptions",
          "fullscreen"
        ],
        "buttons_expand":[
          "colors",
          "find",
          "size"
        ]
      }
    },
    "tool":"BubbleChart",
    "relateditems":[
      {
        "_id":"5600aedc188967b26265a73e",
        "_relatedTo":[
          "55f71e8ccdedc1ff074e9f6d",
          "55f70fd5dbbfabe3d6a2753f"
        ],
        "link":"http://www.gapminder.org/posters/gapminder-world-2013/",
        "image":"//cms.gapminder.org/files-api/p3media/file/image?id=209&preset=160x96&title=media&extension=.jpg",
        "subtitle":"This chart compares Life Expectancy & GDP per capita of 182 nations in 2013.",
        "title":"Gapminder World Poster 2013",
        "__v":0
      },
      {
        "_id":"5600ad4c188967b26265a73b",
        "_relatedTo":[
          "55f71e8ccdedc1ff074e9f6d",
          "55f70fd5dbbfabe3d6a2753f"
        ],
        "link":"http://www.gapminder.org/answers/will-saving-poor-children-lead-to-overpopulation/",
        "image":"//cms.gapminder.org/files-api/p3media/file/image?id=409&preset=160x96&title=media&extension=.jpg",
        "subtitle":"Short answer — No. The opposite.",
        "title":"Will saving poor children lead to overpopulation?",
        "__v":0
      },
      {
        "_id":"560061d4fc0d7c00002110a4",
        "title":"How Reliable is the World Population Forecast?",
        "subtitle":"Short answer — Very reliable",
        "image":"//cms.gapminder.org/files-api/p3media/file/image?id=136&preset=160x96&title=media&extension=.jpg",
        "link":"http://www.gapminder.org/answers/how-reliable-is-the-world-population-forecast/",
        "_relatedTo":[
          "55f71e8ccdedc1ff074e9f6d",
          "55f70fd5dbbfabe3d6a2753f"
        ]
      },
      {
        "_id":"5600782dabde580e33c79e24",
        "_relatedTo":[
          "55f71e8ccdedc1ff074e9f6d"
        ],
        "link":"http://www.gapminder.org/answers/how-did-the-world-population-change/",
        "image":"//cms.gapminder.org/files-api/p3media/file/image?id=247&preset=160x96&title=media&extension=.jpg",
        "subtitle":"First slowly. Then fast.",
        "title":"How Did The World Population Change?",
        "__v":0
      },
      {
        "_id":"5600ae2b188967b26265a73c",
        "_relatedTo":[
          "55f71e8ccdedc1ff074e9f6d",
          "55f70fd5dbbfabe3d6a2753f"
        ],
        "link":"http://www.gapminder.org/answers/how-does-income-relate-to-life-expectancy/",
        "image":"//cms.gapminder.org/files-api/p3media/file/image?id=318&preset=160x96&title=media&extension=.jpg",
        "subtitle":"Short answer — Rich people live longer",
        "title":" How Does Income Relate to Life Expectancy?",
        "__v":0
      },
      {
        "_id":"5600ae64188967b26265a73d",
        "_relatedTo":[
          "55f71e8ccdedc1ff074e9f6d",
          "55f70fd5dbbfabe3d6a2753f"
        ],
        "link":"http://www.gapminder.org/answers/how-did-babies-per-woman-change-in-the-world/",
        "image":"//cms.gapminder.org/files-api/p3media/file/image?id=125&preset=160x96&title=media&extension=.jpg",
        "subtitle":"Short answer — It dropped",
        "title":"How Did Babies per Woman Change in the World?",
        "__v":0
      }
    ],
    "slug":"bubbles",
    //"image":"/tools/public/images/tools/bubblechart.png",
    "image": "public/images/tools/bubblechart.png",
    "category":"Tools",
    "title":"Bubble Chart",
    "__v":4
  }
];
var menuXhrResult;
