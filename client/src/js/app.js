'use strict';

let app = null;

const angular = require('angular');
const ngRoute = require('angular-route');
const ngTouch = require('angular-touch');

require('./static-assets');
require('../styles/main.styl');

// Vizabi stuff

require('./vizabi-ws-reader');
app = angular.module('gapminderTools', [ngRoute, ngTouch]);
require('./app.config')(app);
require('./controller')(app);
require('./directives')(app);
require('./services')(app);
