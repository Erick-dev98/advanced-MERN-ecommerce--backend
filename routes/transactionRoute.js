const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
const {
  transferFund,
  verifyAccount,
  getUserTransactions,
  depositFundStripe,
  webhook,
  depositFundFLW,
} = require("../controllers/transactionController");

router.post("/transferFund", express.json(), protect, transferFund);
router.post("/verifyAccount", express.json(), protect, verifyAccount);
router.post(
  "/getUserTransactions",
  express.json(),
  protect,
  getUserTransactions
);
router.post("/depositFundStripe", express.json(), protect, depositFundStripe);
router.post("/webhook", express.raw({ type: "application/json" }), webhook);

router.get("/depositFundFLW", express.json(), depositFundFLW);

module.exports = router;
