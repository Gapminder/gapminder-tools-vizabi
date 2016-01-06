// set up ======================================================================
var express = require('express');
var app = express();                 // create our app w/ express
var mongoose = require('mongoose');           // mongoose for mongodb
var port = process.env.PORT || 3001;         // set the port
var database = require('./config/database');       // load the database config
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var gzipStatic = require('connect-gzip-static');
var path = require('path');
// configuration ===============================================================
// connect to mongoDB database
mongoose.connect(database.url);

// log every request to the console
app.use(morgan('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({'extended': 'true'}));
// parse application/json
app.use(bodyParser.json());
//parse as json IE
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(gzipStatic(path.join(__dirname, '../client/dist')));

// routes ======================================================================
require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(port, '0.0.0.0');
console.log("App listening on port " + port);