var Category = require('../models/categoriesModel');

var utf8 = require('utf8');
var util = require('util');
var url = require('url');
var httpAgent = require('http-agent');
var jsdom = require('jsdom');
var jQuery = require('jQuery');

var categories = [];
var products = [];
var base_url = 'squareup.com';
var html = 'Starting...<br>';

var product_count = 1;

/*
 * GET Sync Products from Square.
 */
exports.index = function(req, res) {
  Category.find({}, function(err, docs) {
    for(var i = 0; i < docs.length; i++) {
      docs[i].remove();
    }
  });

  jsdom.env({
    url: 'https://' + base_url + '/market/pearl-coffee',
    scripts: ["http://code.jquery.com/jquery.js"],
    done: function (errors, window) {
      if(errors) {
        html += '<br>' + errors.toString();
      } else {
        try {
          var urls = [];
          var $ = window.$;
          
          $('.menu-category').each(function() {
            var el = $(this);
            var title = el.find('.menu-category-name').text();

            el.find('.menu-item a').each(function() {
              urls.push( $(this).attr('href').substr(1) );
            });

            var cat = new Category({ name: title, products: [] });
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

    var cat_name = section.find('.item-category .category-info').text();

    product.name = section.find('.item-name').text();
    product.title = product.name + ' - ' + cat_name;
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