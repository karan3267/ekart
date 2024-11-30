const express = require("express");
require("dotenv").config();
const cors = require("cors");
const paymentRoutes = require("./src/routes/payment");
const cartRoutes = require("./src/routes/cartRoutes");
const ordersRoutes = require("./src/routes/orderRoutes");
const authRoutes=require("./src/routes/authRoutes")
const productRoutes = require("./src/routes/productRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/payment", paymentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/cart", cartRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
