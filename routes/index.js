var Category = require('../models/categoriesModel');

/*
 * GET home page.
 */
exports.index = function(req, res){
  Category.find({}, function(err, docs) {
    if(err) {
      docs = [];
    }

    res.render('index', {
      title: 'Pearl Coffee',
      description: 'Pearl Coffee, local, great coffee',
      cateogires: docs
    });
  });
};

/*
 * GET about.
 */
exports.about = function(req, res){
  res.render('about', {
    title: 'Pearl Coffee',
    description: 'Pearl Coffee, local, great coffee'
  });
};

/*
 * GET contact.
 */
exports.contact = function(req, res){
  res.render('contact', {
    title: 'Pearl Coffee',
    description: 'Pearl Coffee, local, great coffee'
  });
};