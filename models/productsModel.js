var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ProductSchema = new Schema({
  name: String,
  title: String,
  keywords: {
    general: [String],
    region: String
  },
  description: String,
  price: Number,
  shipping: String,
  online_sale: Boolean,
  
  url: String,
  
  image_urls: [String],
  
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

module.exports = mongoose.model('Product', ProductSchema);