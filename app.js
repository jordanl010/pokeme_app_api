// dependencies
var express = require('express'),
    logger = require('morgan'),
    cors = require('cors'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    path = require('path');
// create instance of express
var app = express();
// require routes
var routes = require('./api_routes/api.js');
// define middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(cors());
// routes
app.use('/api/', routes);
module.exports = app;
