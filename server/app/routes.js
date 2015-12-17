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

var WSHostUrl = config.WS_HOST + ':' + config.WS_PORT ;
var staticUrl = config.HOST + ':' + config.PORT;

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

  var base = path.join(BASEURL, 'api');
  app.use(base, router);

  var valueKey = {
    'translation/:lang': '/api/vizabi/translation/',
    'waffles/metadata.json': '/api/vizabi/metadata.json',
    'mc_precomputed_shapes.json': '/api/vizabi/mc_precomputed_shapes.json',
    'world-50m.json': '/api/vizabi/world-50m.json',
    'dont-panic-poverty-geo-properties.csv': '/api/vizabi/geo_properties.csv'
  };

  function proxyMiddleware(url) {
    return function (req, res, next) {
      req.pipe(request(url +_.values(req.params) )).pipe(res);
    }

  }

  _.forEach(valueKey, function (value, key) {
    app.get('/api/static/data/' + key, compression(), cache.route({expire: 86400}), proxyMiddleware(WSHostUrl + value));
  });

  /* APP Routes */
  app.get('/', function (req, res) {
    return res.sendFile(path.resolve('./client/dist' + BASEURL + 'redirect.html'));
  });

  app.get('*', function (req, res) {
    return res.sendFile(path.resolve('./client/dist' + BASEURL + 'index.html'));
    // load the single view file
  });
};



