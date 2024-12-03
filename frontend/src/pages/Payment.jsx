import { useDispatch, useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { clearCart } from "../redux/cartSlice";

const stripePromise = loadStripe(
  "pk_test_51QQ7d3B4Or55ocqNa5nLu4abFOmAgu60HTvqTb04gijBQtJO69PUy5tRM6AvuvWayGSNzYlCk5Kopo9BgrXDDxux00M98rR2TG"
);

const Payment = () => {
  const products = useSelector((state) => state.payment.products);
  const customer = useSelector((state) => state.payment.customer);
  const {user}=useSelector((state)=>state.auth)
  const dispatch = useDispatch();

  const handlePayment = async () => {
    const stripe = await stripePromise;

    const response = await fetch(
      "https://ekartback-e2jq.onrender.com/api/payment/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products, customer,user }),
      }
    );

    const session = await response.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
    if (result.error) {
      alert(result.error.message);
    } else {
      dispatch(clearCart(user.id)); // Clear the cart after successful payment
    }
  };

  if (!products || !customer) {
    return <div className="p-6">Invalid payment flow.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Complete Your Payment</h1>
      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="flex flex-col items-center justify-between border p-4 rounded-lg shadow-lg"
          >
            <div className="w-full h-40 flex justify-center items-center mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="object-contain w-full h-full"
              />
            </div>
            <p className="text-lg font-semibold text-gray-800">{product.name}</p>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <p className="text-xl font-bold text-green-600">Amount: ${product.price}</p>
          </div>
        ))}
      </div>

      {/* Pay Now Button */}
      <div className="text-center mt-8">
        <button
          onClick={handlePayment}
          className="bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-600"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Payment;
