const Stripe = require("stripe");

// Instantiate stripe
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

// Calculate Total Price
function calculateTotalPrice(products, cartItems) {
  let totalPrice = 0;

  cartItems.forEach(function (cartItem) {
    const product = products.find(function (product) {
      return product._id?.toString() === cartItem._id;
    });

    if (product) {
      const quantity = cartItem.cartQuantity;
      const price = parseFloat(product.price);
      totalPrice += quantity * price;
    }
  });

  return totalPrice;
}

// calculate discount
function applyDiscount(cartTotalAmount, discountPercentage) {
  var discountAmount = (discountPercentage / 100) * cartTotalAmount;
  var updatedTotal = cartTotalAmount - discountAmount;
  return updatedTotal;
}

module.exports = {
  stripe,
  calculateTotalPrice,
  applyDiscount,
};
