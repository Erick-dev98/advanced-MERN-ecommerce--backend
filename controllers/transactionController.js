const asyncHandler = require("express-async-handler");
const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");
const { stripe } = require("../utils");

// Transfer Funds
const transferFund = asyncHandler(async (req, res) => {
  // Validation

  const { amount, sender, receiver, description, status } = req.body;
  if (!amount || !sender || !receiver) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }
  // Check Sender's account balance
  const user = await User.findOne({ email: sender });
  if (user.balance < amount) {
    res.status(400);
    throw new Error("Insufficient balance");
  }

  // save the transaction
  const newTransaction = await Transaction.create(req.body);

  // decrease the sender's balance
  await User.findOneAndUpdate(
    { email: sender },
    {
      $inc: { balance: -amount },
    }
  );

  // increase the receiver's balance
  await User.findOneAndUpdate(
    { email: receiver },
    {
      $inc: { balance: amount },
    }
  );

  res.status(200).json({ message: "Transaction successful" });
});

// verify Account
const verifyAccount = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.receiver });
  if (!user) {
    res.status(404);
    throw new Error("User Account not found");
  }
  res.status(200).json({ message: "Account Verification Successful" });
});

// getUserTransactions
const getUserTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({
    $or: [{ sender: req.body.email }, { receiver: req.body.email }],
  })
    .sort({ createdAt: -1 })
    .populate("sender")
    .populate("receiver");

  res.status(200).json(transactions);
});

// Deposit Funds With Stripe
const depositFundStripe = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  console.log(amount);
  const user = await User.findById(req.user._id);

  // Create stripe customer
  if (!user.stripeCustomerId) {
    const customer = await stripe.customers.create({ email: user.email });
    user.stripeCustomerId = customer.id;
    user.save();
  }

  // Create Stripe Session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shopito Wallet Deposit",
            description: `Make a deposit of $${amount} to shopito wallet`,
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],
    customer: user.stripeCustomerId,
    success_url:
      process.env.FRONTEND_URL + `/wallet?payment=successful&amount=${amount}`,
    cancel_url: process.env.FRONTEND_URL + "/wallet?payment=failed",
  });

  console.log(session);
  console.log(session.amount_total);

  return res.json(session);
});

// stripe webhook
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

const webhook = asyncHandler(async (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;
  let data;
  let eventType;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    data = event.data.object;
    eventType = event.type;
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  if (eventType === "checkout.session.completed") {
    stripe.customers
      .retrieve(data.customer)
      .then((customer) => {
        console.log(customer);
        console.log("data:", data);
      })
      .catch((err) => console.log(err.message));
  }
});

// app.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   (request, response) => {
//     const sig = request.headers["stripe-signature"];

//     let event;
//     let data;
//     let eventType;

//     try {
//       event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
//       data = event.data.object;
//       eventType = event.type;
//     } catch (err) {
//       response.status(400).send(`Webhook Error: ${err.message}`);
//       return;
//     }

//     // Handle the event
//     if (eventType === "checkout.session.completed") {
//       stripe.customers
//         .retrieve(data.customer)
//         .then((customer) => {
//           console.log(customer);
//           console.log("data:", data);
//         })
//         .catch((err) => console.log(err.message));
//     }

//     // switch (event.type) {
//     //   case 'checkout.session.async_payment_failed':
//     //     const checkoutSessionAsyncPaymentFailed = event.data.object;
//     //     // Then define and call a function to handle the event checkout.session.async_payment_failed
//     //     break;
//     //   case 'checkout.session.async_payment_succeeded':
//     //     const checkoutSessionAsyncPaymentSucceeded = event.data.object;
//     //     // Update user wallet balance
//     //     break;
//     //   // ... handle other event types
//     //   default:
//     //     console.log(`Unhandled event type ${event.type}`);
//     // }
//   }
// );

module.exports = {
  transferFund,
  verifyAccount,
  getUserTransactions,
  depositFundStripe,
  webhook,
};
