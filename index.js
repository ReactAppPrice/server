const mongoose = require("mongoose");
const express = require("express");
const { Expo } = require("expo-server-sdk");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
let port = process.env.PORT || "8080";
let expo = new Expo();
app.use("/uploads", express.static("uploads"));
///////////////////////// MONGOOSE CONNECTION WITH MONGODB ATLAS ////////////////
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

////////////////////// ALL PRODUCTS LIST SCHEMA AND MODEL //////////////
const productslists = new mongoose.Schema({
  _id: String,
  productName: String,
  category: String,
  image: String,
  availableStore: Array,
});
const Item = mongoose.model("Item", productslists);
////////////////////// ALL PRODUCTS LIST SCHEMA AND MODEL //////////////

// for store pushtoken start///////////
const pushtoken = new mongoose.Schema({
  pushToken: String,
});
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
// for store pushtoken END///////////

//////////////////// GET ALL TOKEN FROM API START/////////////////////
app.get("/tokenList", async (req, res) => {
  const tokens = await tokenPush.find({});
  res.send(tokens);
});
//////////////////// GET ALL TOKEN FROM API END /////////////////////

///////////////// FOR SEND NOTIFICATION START ////////////////
const notificationSchema = new mongoose.Schema({
  description: String,
});
const Notification = mongoose.model("Notification", notificationSchema);

app.post("/send-notification", async (req, res) => {
  console.log(req.body);
  const notificationUpdateOnDatabase = new Notification(req.body);
  notificationUpdateOnDatabase.save();
  // if you want to add a notifications in your data base then enable the below two lines///////
  // let data = await Notification.insertMany([...notificationsList]);
  // console.log(data);

  // Get all the push tokens from the database
  const pushTokens = await tokenPush.find({});

  // Get a list of all valid push tokens
  const validPushTokens = [];
  for (let pushToken of pushTokens) {
    if (Expo.isExpoPushToken(pushToken.pushToken)) {
      validPushTokens.push(pushToken.pushToken);
    }
  }
  console.log(validPushTokens);

  // Divide the valid push tokens into chunks of 100
  const chunks = expo.chunkPushNotifications(
    validPushTokens.map((pushToken) => ({
      to: pushToken,
      sound: "default",
      body: `${req.body.description}`,
      data: req.body,
    }))
  );

  // Send push notifications in chunks
  for (let chunk of chunks) {
    try {
      const receipts = await expo.sendPushNotificationsAsync(chunk);
      console.log(receipts);
    } catch (error) {
      console.error(error);
    }
  }

  res.send({ success: true });
});

///////////////// FOR SEND NOTIFICATION END ////////////////

////////////////////////////////// GET ALL NOTIFICATIONS START /////////////////////////////////////
app.get("/showNotifications", async (req, res) => {
  const allNotifications = await Notification.find({});
  res.send(allNotifications);
});
////////////////////////////////// GET ALL NOTIFICATIONS END /////////////////////////////////////
////////////////////////////////////// GET ALL PRODUCTS START /////////////////////
app.get("/allProducts", async (req, res) => {
  let data = await Item.find({});
  res.json(data);
});
////////////////////////////////////// GET ALL PRODUCTS START /////////////////////

///////////////////////////////////////////////// ADD COPOUN START/////////////////////
const COPOUNSchema = new mongoose.Schema({
  dealNumber: String,
  description: String,
  discount: String,
  copounCode: String,
  isAvailable: Boolean,
});
const Copouns = mongoose.model("copouns", COPOUNSchema);

app.post("/send-copoun", async (req, res) => {
  const updateCopounsDatabase = new Copouns(req.body);
  updateCopounsDatabase.save();
  // let data = await Copouns.insertMany([...productsData]);
  // console.log(data);

  // Get all the push tokens from the database
  const pushTokens = await tokenPush.find({});

  // Get a list of all valid push tokens
  const validPushTokens = [];
  for (let pushToken of pushTokens) {
    if (Expo.isExpoPushToken(pushToken.pushToken)) {
      validPushTokens.push(pushToken.pushToken);
    }
  }
  console.log(validPushTokens);

  // Divide the valid push tokens into chunks of 100
  const chunks = expo.chunkPushNotifications(
    validPushTokens.map((pushToken) => ({
      to: pushToken,
      sound: "default",
      body: `${req.body.description}`,
      data: req.body,
    }))
  );

  // Send push notifications in chunks
  for (let chunk of chunks) {
    try {
      const receipts = await expo.sendPushNotificationsAsync(chunk);
      console.log(receipts);
    } catch (error) {
      console.error(error);
    }
  }

  res.send({ success: true });
});
///////////////////////////////////////////////// ADD COPOUN END/////////////////////

//////////////////////////////////// GET ALL COPOUNS START///////////////////
app.get("/copouns", async (req, res) => {
  const copouns = await Copouns.find({});
  console.log(copouns);
  res.send(copouns);
});
//////////////////////////////////// GET ALL COPOUNS END///////////////////

app.listen(port, () => {
  console.log("listning....");
});
