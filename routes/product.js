
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

/*
 * GET Sync Products from Square.
 */
exports.sync = function(req, res){
  var base_url = 'https://squareup.com/market/pearl-coffee';

  // Curl Base URL
  // Parse HTML for Categories and Products
  // Create or Update Categories to DB

  // Curl Each Product
    // Parse HTML for Product Data

    // Create or Update Products to DB

  res.send("Sync'd");
};