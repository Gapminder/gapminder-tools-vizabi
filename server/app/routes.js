var _ = require('lodash');
var path = require('path');
var config = require('../config');
// for frontend
var cache = require('express-redis-cache')({
  client: require('../config/redis-client')
});

var express = require('express');
var mongoose = require('mongoose');
var compression = require('compression');

require('./models');
var Item = mongoose.model('Item');
var Menu = mongoose.model('Menu');
var BASEURL = '/tools/';

var http = require('http');
var url = require('url');
var request = require('request');

var WSHostUrl = config.WS_HOST + ':' + config.WS_PORT;
var staticUrl = config.HOST + ':' + config.PORT;

var webshot = require('webshot');
var URLON = require('URLON');
var fs = require('fs');
var base64Stream = require('base64-stream');

// DEP :: "base-64": "^0.1.0",
//var base64 = require('base-64');


module.exports = function (app) {
  var router = express.Router();
  /* API Routes */

  function getAll(res, model, populate) {
    var found = model.find().lean(true);
    if (populate) {
      found = found.populate(populate);
    }

    return found.exec(function (err, items) {
      if (err) {
        return res.send(err);
      }

      return res.json(items);
    });
  }

  function getOne(res, model, conditions, populate) {
    var found = model.findOne(conditions).lean(true);
    if (populate) {
      found = found.populate(populate);
    }

    return found.exec(function (err, item) {
      if (err) {
        return res.send(err);
      }
      return res.json(item);
    });
  }

  function getRelatedItem(res, id) {
    return getOne(res, RelatedItem, {"_id": ObjectId(id)}, '_relatedTo');
  }

  function getItems(res) {
    return getAll(res, Item, 'relateditems');
  }


  router.get('/item', compression(), function (req, res) {
    return getItems(res);
  });


  // TEST MAGIC :: ROUTE 1 :: Mock state

  router.post('/testmagicstep1', compression(), function (req, res) {

    var expectedSuggestion = {
      parent_when_one_selected: {
        entities: ['europe', 'africa', 'americas', 'asia', 'ukr'],
        activeEntities: ['europe', 'world'],
        entityConcepts: ['global', 'world_4region'],
        //entityConcepts: ["country", "unstate"],
        measures: ['population', 'child_mortality_rate_percent'],
        //measures: ["child_mortality_rate_per1000", "gdp_p_cap_const_ppp2011_dollar"],
        time: 2008
      }
    };

    return res.json({data:expectedSuggestion});
  });

  // TEST MAGIC :: ROUTE 2 :: Take Screenshot

  router.post('/testmagicstep2', function (req, res) {

    var data = req.body.hash;
    var chartType = req.body.chartType;
    chartType += '_' + String(Date.now());

    var options = {
      screenSize: {
        width: 750,
        height: 400
      },
      /*shotSize: {
        width: 600,
        height: 400
      },*/
      shotOffset: {
        top: 70,
        left: 20,
        right: 110,
        bottom: 115
      },
      //customCSS: '.vzb-placeholder .vzb-tool { background-color: #DDDDDD; }',
      timeout: 7500,
      renderDelay: 750,
      errorIfJSException: false,
      takeShotOnCallback: true,
      streamType:'png',
      quality: 100
    };

    // errorIfStatusIsNot200: true,
    // takeShotOnCallback: true

    var webHostUrl = staticUrl + '/tools/' + req.body.chartType + '?snapshot#' + data;
    var webHostPathImage = path.join(__dirname, '../screens/', chartType + '.png');

    console.log("testmagicstep2::webHostUrl", webHostUrl);
    console.log("testmagicstep2::webHostPathImage", webHostPathImage);

    webshot(webHostUrl, options, function (err, renderStream) {
    //webshot(webHostUrl, webHostPathImage, options, function (err, renderStream) {
      //renderStream.pipe(res);
      if (err) {
        return res.status(500).json(err);
      }

      renderStream.pipe(base64Stream.encode()).pipe(res);
    });
  });

  /*
     console.log("webshot::", err);
     if (err) {
      return res.send({
        error: JSON.stringify(err)
      });
     }
     console.log("Server::ScreenshotReady!", webHostPathImage);
     //return res.sendFile(webHostPathImage);
     fs.readFile(webHostPathImage, function(err, original_data){
      var base64Image = original_data.toString('base64');
      return res.send({
        images: [base64Image]
      });
     });
   */


  router.get('/menu', compression(), function (req, res) {
    return Menu
      .findOne({
        menu_label: 'Home'
      })
      .lean(true)
      .exec(function (err, item) {

        if (err) {
          return res.send(err);
        }

        return res.json(item);
      });
  });

  var valueKey = {
    'translation/:lang': '/api/vizabi/translation/',
    'waffles/metadata.json': '/api/vizabi/metadata.json',
    'mc_precomputed_shapes.json': '/api/vizabi/mc_precomputed_shapes.json',
    'world-50m.json': '/api/vizabi/world-50m.json',
    'dont-panic-poverty-geo-properties.csv': '/api/vizabi/geo_properties.csv'
    'suggestions': '/api/suggestions'
  };

  function proxyMiddleware(url) {
    return function (req, res, next) {
      req.pipe(request(url + _.values(req.params))).pipe(res);
    };
  }

  _.forEach(valueKey, function (value, key) {
    router.get('/static/data/' + key, compression(), cache.route({expire: 86400}), proxyMiddleware(WSHostUrl + value));
  });

  var base = path.join(BASEURL, 'api');
  app.use(base, router);

  /* APP Routes */
  app.get('/', function (req, res) {
    return res.sendFile(path.resolve('./client/dist' + BASEURL + 'redirect.html'));
  });

  app.get('*', function (req, res) {
    return res.sendFile(path.resolve('./client/dist' + BASEURL + 'index.html'));
    // load the single view file
  });
};



