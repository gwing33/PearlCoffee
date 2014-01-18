var Category = require('../models/categoriesModel');

var utf8 = require('utf8');
var util = require('util');
var url = require('url');
var httpAgent = require('http-agent');
var jsdom = require('jsdom');
var jQuery = require('jQuery');
var slug = require('slug');

var categories = [];
var products = [];
var base_url = 'squareup.com';
var html = 'Starting...<br>';


var product_count = 1;

/*
 * GET Sync Products from Square.
 */
exports.index = function(req, res) {
  // Removes all Cateogries, starts from scratch
  Category.find({}, function(err, docs) {
    for(var i = 0; i < docs.length; i++) {
      docs[i].remove();
    }
  });
  
  var square_url = 'https://' + base_url + '/market/pearl-coffee';
  custom_log('Scrapping for all pages: <a target="_blank" href="' + square_url + '">' + square_url + '</a>');
  
  jsdom.env({
    url: square_url,
    scripts: ["http://code.jquery.com/jquery.js"],
    done: function (errors, window) {
      if(errors) {
        html += '<br>' + errors.toString();
      } else {
        try {
          var urls = [];
          var $ = window.$;
          
          $('.item-category').each(function() {
            var el = $(this);
            var title = el.find('.module-name').text();
            var cat_slug = slug(title);

            el.find('.item-element a').each(function() {
              urls.push( $(this).attr('href').replace('https://squareup.com/','') );
            });

            var cat = new Category({ name: title, slug: cat_slug, products: [] });
            cat.save();
          });

          custom_log('Categories Collected');

          // Continue to collecting products
          collectProducts(res, urls);
        } catch(e) {
          res.send('<br>' + e);
        }
      }
    }
  });
};

function collectProducts(res, urls) {
  console.log(urls);
  var agent = httpAgent.create('squareup.com', urls);
  
  custom_log('Scraping ' + urls.length + ' pages from ' + agent.host);
   
  agent.addListener('next', function (err, agt) {
    if(err) {
      custom_log(err);
      agent.stop();
    }

    var product = getProductData(agt);
    console.log('Populated Product ' + product_count);
    
    product_count++;
    agent.next();
  });
   
  agent.addListener('stop', function (err, agent) {
    if (err) {
      custom_log(err);
    }

    custom_log('<b>DONE!</b>');

    res.send(html);
  });
   
  // Start scraping
  agent.start();
}

function getProductData(agent) {
  try {
    var product = {};
    
    if(agent.response.statusCode != 200) {
      custom_log('Page Not Loaded: ' + agent.response.statusCode);
      custom_log('Page URL: ' + agent.url);
      return;
    }

    var window = jsdom.jsdom(agent.body, null, {
      features: {
        FetchExternalResources: false
      }
    }).createWindow();
    
    var $ = jQuery.create(window);

    var section = $('#content');

    var cat_name = $('.category-info').first().text();

    product.name = section.find('.item-name').text();
    product.title = product.name + ' - ' + cat_name;
    product.slug = slug(product.name);
    product.description = utf8.encode( section.find('.item-description').html() );
    product.price = section.find('.item-amount-price').text();
    
    var shipping = section.find('.item-amount-shipping').text();
    
    product.online_sale = shipping.indexOf('Available in-store') == -1;
    product.url = 'https://' + base_url + '/' + agent.url;
    product.image_urls = [ section.find('.item-image').attr("src") ];

    Category.findOne({name: cat_name}, function(err, doc) {
      console.log('Found Category');
      if(err) console.log(err);

      console.log('Saving Product: ' + product.url);
      doc.products.push(product);
      doc.save();
    });
  } catch(e) {
    custom_log('<br>' + e);
    agent.stop();
  }
}

function custom_log(msg) {
  console.log(msg);
  html += msg + '<br>';
}