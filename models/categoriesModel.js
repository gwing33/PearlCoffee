var mongoose = require("mongoose");
var Product = require("./productsModel");

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CategoriesSchema = new Schema({
  name: String,
  keywords: [String],
  url: String,

  products: [Product],

  info: {
    created: {
      type: Date,
      default: Date.now
    },
    updated: {
      type: Date,
      default: Date.now
    }
  }
});

module.exports = mongoose.model('Category', CategoriesSchema);