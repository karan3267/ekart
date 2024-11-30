const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Create Stripe Checkout Session
router.post("/create-checkout-session", async (req, res) => {
  const { products, customer } = req.body;

  try {
    // Create line items for each product
    const lineItems = products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          description: product.description,
          images: [product.image],
        },
        unit_amount: product.price * 100, // Convert price to cents
      },
      quantity: product.quantity, // Ensure the product has a quantity field
    }));

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems, // Pass the array of line items
      customer_email: customer.email,
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: "Failed to create Stripe session" });
  }
});

module.exports = router;
