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

// for strore pushtoken ///////////
const pushtoken = new mongoose.Schema({
  pushToken: String,
});

// token schema into a model
const tokenPush = mongoose.model("tokens", pushtoken);

app.post("/push-token", async (req, res) => {
  const token = new tokenPush({ pushToken: req.body.pushtoken });
  token
    .save()
    .then((data) => {
      res.json({ success: true });
    })
    .catch((err) => {
      res.json({ success: false });
    });
});


// if you delete alla the items then just open this code and call api
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
