const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const axios = require("axios");

const { createOrder, capturePayment } = require("./api/paypal-api");

const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const orderRoute = require("./routes/orderRoute");
const transactionRoute = require("./routes/transactionRoute");
const couponRoute = require("./routes/couponRoute");
const categoryRoute = require("./routes/categoryRoute");
const brandRoute = require("./routes/brandRoute");
// const contactRoute = require("./routes/contactRoute");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();
// Middlewares
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["http://localhost:3000", "https://shopito-app.vercel.app"],
    credentials: true,
  })
);

app.use("/api/transaction", transactionRoute);
app.use(express.json());

// Routes Middleware
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/order", orderRoute);
app.use("/api/coupon", couponRoute);
app.use("/api/category", categoryRoute);
app.use("/api/brand", brandRoute);

// app.use("/api/contactus", contactRoute);

// Routes
app.get("/", (req, res) => {
  console.log("Home Page");
  res.send("Home Page...");
});

// FlutterWave Payment verification
app.get("/response", async (req, res) => {
  const { transaction_id } = req.query;

  // Confirm transaction
  const url = `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`;

  const response = await axios({
    url,
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: process.env.FLW_SECRET_KEY,
    },
  });

  console.log(response.data.data);
  const { amount, customer, tx_ref } = response.data.data;

  const successURL =
    process.env.FRONTEND_URL + "/checkout-flutterwave?payment=successful";
  const failureURL =
    process.env.FRONTEND_URL + "/checkout-flutterwave?payment=failed";
  if (req.query.status === "successful") {
    res.redirect(successURL);
  } else {
    res.redirect(failureURL);
  }
});

// Paypay Payment
app.post("/my-server/create-paypal-order", async (req, res) => {
  try {
    const order = await createOrder(req.body);
    res.json(order);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/my-server/capture-paypal-order", async (req, res) => {
  const { orderID } = req.body;
  try {
    const captureData = await capturePayment(orderID);
    res.json(captureData);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Error Middleware
app.use(errorHandler);
// Connect to DB and start server
const PORT = process.env.PORT || 5000;
mongoose
  .set("strictQuery", false)
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
