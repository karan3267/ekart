const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (amount) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to smallest currency unit
    currency: 'usd',
  });
  return paymentIntent.client_secret;
};

module.exports = { createPaymentIntent };
