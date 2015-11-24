module.exports = function (app) {
  app
    .factory('readerService', ['$http', 'config', function ($http, config) {
      //todo: use http
      return {
        //relative path
        getFile: function (fileData, cb) {
          if (config.isChromeApp) {
            getChromeAppFile(fileData, cb);
          }

          if (config.isElectronApp) {
            getElectronAppFile(fileData, cb);
          }

          function getChromeAppFile(fileData, cb) {
            //todo: use http
            var xhr = new XMLHttpRequest();
            xhr.responseType = fileData.type;
            xhr.open('GET', fileData.path, true);
            xhr.onreadystatechange = function () {
              if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                cb(null, xhr.response);
              } else if (xhr.readyState == XMLHttpRequest.DONE) {
                console.log('can\'t load metadata');
                cb(true);
              }
            };
            xhr.send();
          }

          function getElectronAppFile(fileData, cb) {
            var fs = require('fs');
            fs.readFile(fileData.path, 'utf8', cb);
          }
        },
        getDataFilePath: function() {
          //@todo: get data file path based on config.platform(electron or chrome)
        },
        parseCsvFile: function() {
          //todo: use this.readFile
        },
        parseCsvData: function() {

        }
      };

    }]);
};
