const express = require("express");
const Category = require("../models/category");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const category = await Category.find();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error });
  }
});
module.exports=router;