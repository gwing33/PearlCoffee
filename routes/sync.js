var Category = require('../models/categoriesModel');

var utf8 = require('utf8');
var util = require('util');
var url = require('url');
var httpAgent = require('http-agent');
var jsdom = require('jsdom');
var jQuery = require('jQuery');
var slug = require('slug');


/*
 * GET Sync Products from Square.
 */
exports.index = function(req, res) {
  res.render('sync', {
    title: 'Pearl Coffee',
    description: 'Pearl Coffee, local, great coffee'
  });
};

exports.getCategories = function(req, res) {
  var log = [];
  if(req.query.code != "boomboomyall") {
    log.push('Invalid Code');
    return res.json(500, { log: log });
  }

  // Removes all Cateogries, starts from scratch
  Category.find({}, function(err, docs) {
    for(var i = 0; i < docs.length; i++) {
      docs[i].remove();
    }
  });
  
  var square_url = 'https://squareup.com/market/pearl-coffee';
  log.push('Base URL: ' + square_url);
  
  getDOM(square_url, function (errs, window) {
    if(errs) {
      log.push('Error: ' + errs.toString());
      res.json(500, { log: log });
    } else {
      try {
        var urls = [];
        var $ = window.$;
        
        $('.item-category').each(function() {
          var el = $(this);
          var title = el.find('.module-name').text();
          var cat_slug = slug(title);

          el.find('.item-element a').each(function() {
            urls.push( $(this).attr('href') );
          });

          var cat = new Category({ name: title, slug: cat_slug, products: [] });
          cat.save();
          log.push('Category Added: ' + cat.name);
        });

        res.json({
          log: log,
          urls: urls
        });
      } catch(e) {
        res.json(500, { log: log });
      }
    }
  });

};

exports.getProduct = function(req, res) {
  var log = [];

  getDOM(req.query.url, function(errs, window) {
    if(errs) {
      log.push('Error: ' + errs.toString());
      res.json(500, { log: log });
    } else {
      try {
        var $ = window.$;

        var section = $('#content');

        var cat_name = $('.category-info').first().text();

        var product = {};
        product.name = section.find('.item-name').text();
        product.title = product.name + ' - ' + cat_name;
        product.slug = slug(product.name);
        product.description = utf8.encode( section.find('.item-description').html() );
        product.price = section.find('.item-amount-price').text();
        
        var shipping = section.find('.item-amount-shipping').text();
        
        product.online_sale = shipping.indexOf('Available in-store') == -1;
        product.url = req.query.url;
        product.image_urls = [ section.find('.item-image').attr("src") ];

        Category.findOne({name: cat_name}, function(err, doc) {
          if(err) {
            log.push(err); 
            return res.json(500, { log: log });
          }

          doc.products.push(product);
          doc.save();

          log.push('Product URL Saved: ' + product.url);

          res.json({ log: log });
        });
      } catch(e) {
        log.push(e);
        res.json(500, { log: log });
      }
    }
  });
};

function getDOM(url, callback) {
  jsdom.env({
    url: url,
    scripts: ["http://code.jquery.com/jquery.js"],
    done: callback
  });
}