const express = require("express");
const Cart = require("../models/Cart");
const verifyToken = require("../middleware/auth");
const router = express.Router();

// Get user's cart
router.get("/", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
    res.status(200).json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Add an item to the cart
router.post("/", verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (cart) {
      // Update existing cart
      const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
      await cart.save();
    } else {
      // Create new cart
      await Cart.create({ userId: req.user.id, items: [{ productId, quantity }] });
    }

    res.status(200).json({ message: "Item added to cart" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
