
/*
 * GET Product Page.
 */
exports.item = function(req, res){
  res.render('index', { title: 'Express' });
};

/*
 * GET All Products.
 */
exports.list = function(req, res){
  res.render('index', { title: 'Express' });
};

/*
 * GET Sync Products from Square.
 */
exports.sync = function(req, res){
  res.send("Sync'd");
};