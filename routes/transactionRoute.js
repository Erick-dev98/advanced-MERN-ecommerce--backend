const express = require("express");
const { protect } = require("../middleWare/authMiddleware");
const router = express.Router();
const {
  transferFund,
  verifyAccount,
  getUserTransactions,
  depositFundStripe,
  webhook,
} = require("../controllers/transactionController");

router.post("/transferFund", protect, transferFund);
router.post("/verifyAccount", protect, verifyAccount);
router.post("/getUserTransactions", protect, getUserTransactions);
router.post("/depositFundStripe", protect, depositFundStripe);
router.post("/webhook", express.json({ type: "application/json" }), webhook);

module.exports = router;
