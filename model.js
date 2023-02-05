const mongoose = require("mongoose");
let productsSchema = new mongoose.Schema({
  productName: String,
  productCategeory: String,
  productImage: String,
  storesList: String,
});

let productsList = mongoose.model("products", productsSchema);

module.exports = productsList;
