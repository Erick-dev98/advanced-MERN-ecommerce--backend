const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");

const createOrder = asyncHandler(async (req, res) => {
  const {
    orderDate,
    orderTime,
    orderAmount,
    orderStatus,
    cartItems,
    shippingAddress,
    paymentMethod,
  } = req.body;

  //   Validation
  if (!cartItems || !orderStatus || !shippingAddress || !paymentMethod) {
    res.status(400);
    throw new Error("Order data missing!!!");
  }

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
  orders = await Order.find({ user: req.user.id }).sort("-createdAt");
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

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
};
