var Category = require('../models/categoriesModel');

/*
 * GET Product Page.
 */
exports.item = function(req, res){

  Category.findOne({ slug: req.params.cat_slug, "products.slug": req.params.slug }, {'products.$': 1}, function(err, category) {
    res.render('product', { title: 'Express', description: 'asdf', category: category });
  });
  
};

/*
 * GET All Products.
 */
exports.list = function(req, res){
  Category.findOne( { slug: req.params.cat_slug }, function(err, category) {
    console.log(category);
    res.render('products', { title: 'Express', description: 'asdf', category: category });
  });
};