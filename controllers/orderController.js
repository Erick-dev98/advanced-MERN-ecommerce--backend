const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const { calculateTotalPrice } = require("../utils");
const Product = require("../models/productModel");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const axios = require("axios");
const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");
const { orderSuccessEmail } = require("../emailTemplates/orderTemplate");
const sendEmail = require("../utils/sendEmail");

const createOrder = asyncHandler(async (req, res) => {
  const {
    orderDate,
    orderTime,
    orderAmount,
    orderStatus,
    cartItems,
    shippingAddress,
    paymentMethod,
    coupon,
  } = req.body;

  //   Validation
  if (!cartItems || !orderStatus || !shippingAddress || !paymentMethod) {
    res.status(400);
    throw new Error("Order data missing!!!");
  }

  const updatedProduct = await updateProductQuantity(cartItems);
  // console.log("updated product", updatedProduct);

  // Create Order
  await Order.create({
    user: req.user.id,
    orderDate,
    orderTime,
    orderAmount,
    orderStatus,
    cartItems,
    shippingAddress,
    paymentMethod,
    coupon,
  });

  res.status(201).json({ message: "Order Created" });
});

// Get all Orders
const getOrders = asyncHandler(async (req, res) => {
  let orders;

  if (req.user.role === "admin") {
    orders = await Order.find().sort("-createdAt");
    return res.status(200).json(orders);
  }
  orders = await Order.find({ user: req.user._id }).sort("-createdAt");
  res.status(200).json(orders);
});

// Get single Order
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  // if product doesnt exist
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (req.user.role === "admin") {
    return res.status(200).json(order);
  }
  // Match Order to its user
  if (order.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  res.status(200).json(order);
});

// Update Product
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body;
  const { id } = req.params;

  const order = await Order.findById(id);

  // if product doesnt exist
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Update Product
  await Order.findByIdAndUpdate(
    { _id: id },
    {
      orderStatus: orderStatus,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ message: "Order status updated" });
});

// Pay with stripe
const payWithStripe = asyncHandler(async (req, res) => {
  const { items, shipping, description, coupon } = req.body;
  const products = await Product.find();

  let orderAmount;
  orderAmount = calculateTotalPrice(products, items);
  if (coupon !== null && coupon?.name !== "nil") {
    let totalAfterDiscount =
      orderAmount - (orderAmount * coupon.discount) / 100;
    orderAmount = totalAfterDiscount;
  }

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: orderAmount,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
    description,
    shipping: {
      address: {
        line1: shipping.line1,
        line2: shipping.line2,
        city: shipping.city,
        country: shipping.country,
        postal_code: shipping.postal_code,
      },
      name: shipping.name,
      phone: shipping.phone,
    },
    // receipt_email: customerEmail
  });

  // console.log(paymentIntent);

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

// Verify FLW Payment
const verifyFlwPayment = asyncHandler(async (req, res) => {
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

  // console.log(response.data.data);
  const { amount, customer, tx_ref } = response.data.data;

  const successURL =
    process.env.FRONTEND_URL +
    `/checkout-flutterwave?payment=successful&ref=${tx_ref}`;
  const failureURL =
    process.env.FRONTEND_URL + "/checkout-flutterwave?payment=failed";
  if (req.query.status === "successful") {
    res.redirect(successURL);
  } else {
    res.redirect(failureURL);
  }
});

// Pay With Flutterwave // NOT WORKING
const payWithFlutterwave = async (req, res) => {
  const { items, userID } = req.body;
  const products = await Product.find();
  const user = await User.findById(userID);
  const orderAmount = calculateTotalPrice(products, items);
  // console.log(orderAmount);
  // const url = "https://jsonplaceholder.typicode.com/posts";
  const url = "https://api.flutterwave.com/v3/payments";
  const json = {
    tx_ref: "shopito-48981487343MDI0NzMx",
    amount: orderAmount,
    currency: "USD",
    // payment_options: "card, banktransfer, ussd",
    redirect_url: "http://localhost:5000/response",
    //   meta: {
    //     consumer_id: 23,
    //     consumer_mac: "92a3-912ba-1192a",
    //   },
    customer: {
      email: user?.email,
      phone_number: user.phone,
      name: user.name,
    },
    customizations: {
      title: "Shopito Online Store",
      description: "Payment for products",
      logo: "https://www.logolynx.com/images/logolynx/22/2239ca38f5505fbfce7e55bbc0604386.jpeg",
    },
  };

  axios
    .post(url, json, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
      },
    })
    .then(({ data }) => {
      // console.log(data);
      return res.status(200).json(data);
    })
    .catch((err) => {
      // console.log(err.message);
      return res.json(err.message);
    });
};

// pAYWith Wallet
// Pay with Wallet
const payWithWallet = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { items, cartItems, shippingAddress, coupon } = req.body;
  // console.log(coupon);
  const products = await Product.find();
  const today = new Date();

  let orderAmount;
  orderAmount = calculateTotalPrice(products, items);
  if (coupon !== null && coupon?.name !== "nil") {
    let totalAfterDiscount =
      orderAmount - (orderAmount * coupon.discount) / 100;
    orderAmount = totalAfterDiscount;
  }
  // console.log(orderAmount);
  // console.log(user.balance);

  if (user.balance < orderAmount) {
    res.status(400);
    throw new Error("Insufficient balance");
  }

  const newTransaction = await Transaction.create({
    amount: orderAmount,
    sender: user.email,
    receiver: "Shopito store",
    description: "Payment for products.",
    status: "success",
  });

  // decrease the sender's balance
  const newBalance = await User.findOneAndUpdate(
    { email: user.email },
    {
      $inc: { balance: -orderAmount },
    }
  );

  const newOrder = await Order.create({
    user: user._id,
    orderDate: today.toDateString(),
    orderTime: today.toLocaleTimeString(),
    orderAmount,
    orderStatus: "Order Placed...",
    cartItems,
    shippingAddress,
    paymentMethod: "Shopito Wallet",
    coupon,
  });

  // Update Product quantity
  const updatedProduct = await updateProductQuantity(cartItems);
  // console.log("updated product", updatedProduct);

  // Send Order Email to the user
  const subject = "Shopito Order Placed";
  const send_to = user.email;
  // const send_to = "zinotrust@gmail.com";
  const template = orderSuccessEmail(user.name, cartItems);
  const reply_to = "donaldzee.ng@gmail.com";
  // const cc = "donaldzee.ng@gmail.com";

  await sendEmail(subject, send_to, template, reply_to);

  if (newTransaction && newBalance && newOrder) {
    return res.status(200).json({
      message: "Payment successful",
      url: `${process.env.FRONTEND_URL}/checkout-success`,
    });
  }
  res
    .status(400)
    .json({ message: "Something went wrong, please contact admin" });
});

const updateProductQuantity = async (cartItems) => {
  // Update Product quantity
  let bulkOption = cartItems.map((product) => {
    return {
      updateOne: {
        filter: { _id: product._id }, // IMPORTANT item.product
        update: {
          $inc: {
            quantity: -product.cartQuantity,
            sold: +product.cartQuantity,
          },
        },
      },
    };
  });
  let updatedProduct = await Product.bulkWrite(bulkOption, {});
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  payWithStripe,
  verifyFlwPayment,
  payWithFlutterwave,
  payWithWallet,
};
