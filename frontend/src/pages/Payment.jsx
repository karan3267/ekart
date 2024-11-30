import React from "react";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51QQ7d3B4Or55ocqNa5nLu4abFOmAgu60HTvqTb04gijBQtJO69PUy5tRM6AvuvWayGSNzYlCk5Kopo9BgrXDDxux00M98rR2TG"
);

const Payment = () => {
  const products = useSelector((state) => state.payment.products);
  const customer = useSelector((state) => state.payment.customer);

  const handlePayment = async () => {
    const stripe = await stripePromise;

    const response = await fetch(
      "http://localhost:5000/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products, customer }),
      }
    );

    const session = await response.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      alert(result.error.message);
    }
  };

  if (!products || !customer) {
    return <div className="p-6">Invalid payment flow.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Payment</h1>
      {products.map((product) => (
        <>
          <div className="flex flex-col gap-2 overflow-hidden">
            <p>Pay for: {product.name}</p>
            <p>Amount: ${product.price}</p>
            <div className=" object-contain w-24 h-24 py-2">
              <img src={product.image} alt="product" />
            </div>
          </div>
        </>
      ))}
      <button
        onClick={handlePayment}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Pay Now
      </button>
    </div>
  );
};

export default Payment;
