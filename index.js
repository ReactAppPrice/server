const mongoose = require("mongoose");
const express = require("express");
const productList = require("./model");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://0.0.0.0:27017/priceComparison")
  .then(() => {
    console.log("Connected");
  })
  .catch((e) => {
    console.log("error");
  });

app.get("/products", async (req, res) => {
  let data = await productList.find({});
  res.json(data);
});
app.listen("4200");
