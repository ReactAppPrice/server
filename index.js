const mongoose = require("mongoose");
const express = require("express");
const productList = require("./model");
const products = require("./groceryItemsWithPrice.json");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

let port = process.env.PORT || "8080";
mongoose
  .connect(
    "mongodb+srv://huzaifa:fireburning300@cluster0.xxwlzho.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected");
  })
  .catch((e) => {
    console.log("error");
  });
//////////////////////////////

//////////////////////////////

let db = mongoose.connection;
// Define a schema for the collection
const productslists = new mongoose.Schema({
  _id: String,
  productName: String,
  category: String,
  image: String,
  availableStore: Array,
});

// Compile the schema into a model
const Item = mongoose.model("Item", productslists);
// app.post("/products", async (req, res) => {
//   let data = await Item.insertMany([...aaa]);
//   res.json(data);
//   res.json(products);
// });

app.get("/allProducts", async (req, res) => {
  let data = await Item.find({});
  res.json(data);
});
app.listen(port, () => {
  console.log("listning....");
});
