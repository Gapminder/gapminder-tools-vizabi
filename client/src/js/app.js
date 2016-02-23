require('./static-assets');
require('../styles/main.scss');

var angular = require('angular');
var ngRoute = require('angular-route');
var ngTouch = require('angular-touch');
// Vizabi stuff

require('./vizabi-ws-reader');
var app = angular.module('gapminderTools', [ngRoute, ngTouch]);
require('./app.config')(app);
require('./controller')(app);
require('./directives')(app);

// Suggestions :: Services
require('./tools/helper')(app);
require('./tools/vizabi.external.js')(app);
// Suggestions :: Factory
require('./services/snapshot')(app);
require('./services/suggestion')(app);

// GapMinder Services
require('./services')(app);
