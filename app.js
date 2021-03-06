#!/bin/env node

/**
 * Module dependencies.
 */

var express = require('express');
var expressLayouts = require('express-ejs-layouts');

var mongoose = require("mongoose");
var config   = require("./config");

var routes = require('./routes');
var product = require('./routes/product');
var sync = require('./routes/sync');

var http = require('http');
var path = require('path');

var app = express();

// all environments
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

console.warn(ipaddress, port);

app.set('ipaddr', ipaddress);
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
app.set('layout', '_layout');
app.set('layout extractScripts', true);
app.use(expressLayouts);

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


// Database Settings
var db = mongoose.connect(config.settings.conn_str);
var Schema = mongoose.Schema;


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());

  mongoose.connection.on("error", function(errorObject) {
    return console.log('API DB Connection Error:', errorObject);
  });
}

app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/contact', routes.contact);
app.get('/product/:cat_slug', product.list);
app.get('/product/:cat_slug/:slug', product.item);
app.get('/sync/products', sync.index);
app.get('/sync/products/categories', sync.getCategories);
app.get('/sync/products/url', sync.getProduct);

http.createServer(app).listen(app.get('port'), app.get('ipaddr'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
