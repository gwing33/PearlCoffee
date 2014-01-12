var mongoose = require("mongoose");
var ProductSchema = require('./productsModel');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CategoriesSchema = new Schema({
  name: String,

  products: [ProductSchema]
});

module.exports = mongoose.model('Category', CategoriesSchema);