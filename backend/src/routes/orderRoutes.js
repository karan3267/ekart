const express = require("express");
const Order = require("../models/Order");
const verifyToken = require("../middleware/auth");
const router = express.Router();

// Create a new order
router.post("/", verifyToken, async (req, res) => {
  const { items, shippingAddress, totalAmount, paymentMethod, paymentStatus } = req.body;

  try {
    // Create the order
    const order = new Order({
      userId: req.user.id,
      items,
      shippingAddress,
      totalAmount,
      paymentMethod,
      paymentStatus,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Get user's orders
router.get("/", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate("items.productId");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Admin: Get all orders
router.get("/all", verifyToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Access denied" });

  try {
    const orders = await Order.find().populate("items.productId userId");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Admin: Update order status
router.put("/:id", verifyToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Access denied" });

  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete an order (Admin only)
router.delete("/:id", verifyToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Access denied" });

  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
