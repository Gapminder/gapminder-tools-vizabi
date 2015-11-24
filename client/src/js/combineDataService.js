module.exports = function (app) {
  app
    .factory('combineDataService', ['config', 'readerService', function (config, readerService) {
      //todo: use http
      return {
        //relative path
        combine: function (graphData, cb) {
          this.getGeoData(function(err, geoData) {
            geoData = JSON.parse(geoData);
            var geoHash  = {};
            for (var j = 0; j < geoData.length; j++) {
              geoHash[geoData[j].geo]= geoData[j];
            }


            for (var i = 0; i < graphData.length; i++) {
              graphData[i].time = graphData[i].time + '';
              graphData[i]['geo.name'] = geoHash[graphData[i].geo]['geo.name'];
              graphData[i]['geo.cat'] = geoHash[graphData[i].geo]['geo.cat'];
              graphData[i]['geo.region'] = geoHash[graphData[i].geo]['geo.region'];
            }
            cb(err, graphData);
          });
        },
        getGeoData: function(cb) {
          var geoPath;
          var path = require('path');
          if (config.isChromeApp) {
            geoPath = chrome.runtime.getURL('data/geo.json');
          } else if (config.isElectronApp) {
            geoPath = path.join(config.electronPath,'client/src/public/data/geo.json');
          }
          readerService.getFile({
            path: geoPath,
            type: 'json'
          }, cb);
        }
      };

    }]);
};
