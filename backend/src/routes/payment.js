const express = require("express");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Create Stripe Checkout Session
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
      success_url: "http://localhost:5173/success", // You can redirect here for frontend updates
      cancel_url: "http://localhost:5173/cancel",
      metadata: {
        customer_name: customer.name,
        customer_email: customer.email,
        cart_items: JSON.stringify(products),
      },
    });

    res.status(200).json({ id: session.id ,payment_status:session.payment_status,total_amount:session.amount_total});
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: "Failed to create Stripe session" });
  }
});

// Stripe Webhook endpoint to listen for the 'checkout.session.completed' event
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

    console.log("in webhook");
    const event = req.body;

    // try {
    //   // Verify the webhook signature
    //   event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    // } catch (err) {
    //   console.error("Webhook signature verification failed:", err);
    //   return res.status(400).send(`Webhook Error: ${err.message}`);
    // }

    // Handle the event
    try {
      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object;
          console.log(req.body);
          // Payment is successful, now create an order in the database
          // Create order based on session data (You can add other details like customer info here)
          const user=await User.findOne({email:session.customer_email});
          const order = {
            customer: user._id,
            products: session.line_items,
            total: session.amount_total / 100, // Convert from cents to dollars
            status: "paid",
          };

          // Save the order to your database here (for example, using Mongoose)
          // Example: await Order.create(order);
          await Order.create(order);
          await Cart.deleteOne(user._id)
          // Cart.deleteOne({user:session.customer_email})
          // Clear the cart (You can add logic to clear the user's cart here)
          // Example: await Cart.deleteMany({ user: session.customer_email });

          console.log("Order created successfully");
          // res.status(200).send("Payment Successful");
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
      res.status(200).json({ received: true });
    } catch (error) {
      console.error("Error processing webhook event:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
