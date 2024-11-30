const express = require("express");
const Product = require("../models/Product");
const verifyToken = require("../middleware/auth");
const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Create a new product (Admin only)
router.post("/", verifyToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Access denied" });

  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update a product (Admin only)
router.put("/:id", verifyToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Access denied" });

  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete a product (Admin only)
router.delete("/:id", verifyToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Access denied" });

  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
