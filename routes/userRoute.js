const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logout,
  getUser,
  getLoginStatus,
  updateUser,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getCart,
  saveCart,
  clearCart,
  // changePassword,
  // forgotPassword,
  // resetPassword,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
// comment

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/getUser", protect, getUser);
router.get("/getLoginStatus", getLoginStatus);
router.patch("/updateUser", protect, updateUser);
// router.patch("/changepassword", protect, changePassword);
// router.post("/forgotpassword", forgotPassword);
// router.put("/resetpassword/:resetToken", resetPassword);

// wishlist
router.post("/addToWishlist", protect, addToWishlist);
router.get("/getWishlist", protect, getWishlist);
router.put("/wishlist/:productId", protect, removeFromWishlist);

// cart
router.get("/getCart", protect, getCart);
router.patch("/saveCart", protect, saveCart);
router.patch("/clearCart", protect, clearCart);

module.exports = router;
