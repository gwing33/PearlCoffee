var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ProductSchema = new Schema({
  name: String,
  title: String,
  slug: String,
  description: String,
  price: String,
  shipping: String,
  online_sale: Boolean,
  
  url: String,
  
  image_urls: [String]
});

module.exports = ProductSchema;