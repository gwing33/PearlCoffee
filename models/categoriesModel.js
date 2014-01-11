var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CategoriesSchema = new Schema({
  
});

module.exports = mongoose.model('Category', CategoriesSchema);