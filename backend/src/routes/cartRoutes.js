const express = require("express");
const Cart = require("../models/Cart");
const verifyToken = require("../middleware/auth");
const router = express.Router();

// Get the cart for a user
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId }).populate(
      "items.product"
    );
    res.status(200).json(cart || { items: [], totalPrice: 0 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Failed to fetch cart", error });
  }
});

// Add item to the cart
router.post("/", verifyToken, async (req, res) => {
  const { _id: productId, name, price, images } = req.body;
  const quantity = 1;
  const image = images?.[0] || "";

  if (!productId || !price || !name || !image) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      {
        $setOnInsert: {
          user: req.user.id,
          items: [],
          totalPrice: 0,
        },
      },
      { upsert: true, new: true }
    );

    const existingItem = cart.items.find(
      (item) => String(item.name) === String(name)
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, name, quantity, price, image });
    }

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Failed to add item to cart", error });
  }
});

// Remove item from the cart
router.delete("/:productId", verifyToken, async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Filter items by comparing productId with cart item productId
    const updatedItems = cart.items.filter(
      (item) => String(item._id) !== String(productId)
    );

    // Update cart items and recalculate total price
    cart.items = updatedItems;
    cart.totalPrice = updatedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();
    res.status(200).json({ items: cart.items, totalPrice: cart.totalPrice });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ message: "Failed to remove item from cart", error });
  }
});

// Clear the cart
router.delete("/clear/:userId", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOneAndDelete({ user: req.params.userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Failed to clear cart", error });
  }
});

module.exports = router;
