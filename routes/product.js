
/*
 * GET Product Page.
 */
exports.item = function(req, res){
  res.render('product', { title: 'Express', description: 'asdf' });
};

/*
 * GET All Products.
 */
exports.list = function(req, res){
  res.render('products', { title: 'Express', description: 'asdf' });
};