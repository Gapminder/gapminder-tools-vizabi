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

var WSHostUrl = config.EXTERNAL_HOST + ':' + config.EXTERNAL_PORT ;
var staticUrl = config.HOST + ':' + config.PORT;

module.exports = function (app) {
  var router = express.Router();
  /* API Routes */

  var stub = function (req, res, next) {
    console.log(req.query);
    return next();
  };


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

  //insert a related item to the database
  app.post('/related', function (req, res) {

    var relatedTo = req.body._relatedTo.split(",").map(function (id) {
      return ObjectId(id);
    });

    RelatedItem.create({
      title: req.body.title,
      subtitle: req.body.subtitle,
      image: req.body.image,
      link: req.body.link,
      _relatedTo: relatedTo
    }, function (err, related_item) {
      if (err) {
        return res.send(err);
      }

      var new_id = related_item._id;
      var items = related_item._relatedTo;
      var s = items.length;
      for (var i = 0; i < s; i++) {
        Item.findOne({"_id": ObjectId(items[i])}, function (err, item) {
          item.relateditems = item.relateditems.map(function (id) {
            return ObjectId(id);
          });
          item.relateditems.push(new_id);
          item.save();
        });
      }

      return getRelatedItem(res, new_id);
    });
  });

  var base = path.join(BASEURL, 'api');
  app.use(base, router);

  // one day
  app.use('/api/static/local_data', stub, compression(), cache.route({expire: 86400}), express.static(path.join(__dirname, '/fixtures')));

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



