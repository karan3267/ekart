import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart, fetchCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { setProduct } from "../redux/paymentSlice";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.user) {
      dispatch(fetchCart(auth.user.id));
    }
  }, [dispatch, auth.user]);

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      alert("Cart is empty!");
      return;
    }
    dispatch(setProduct(cart.items));
    navigate("/checkout");
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Shopping Cart</h1>
      {cart.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <img
            src="/images/empty-cart.svg"
            alt="Empty Cart"
            className="w-40 mb-4"
          />
          <p className="text-gray-600 text-lg">Your cart is currently empty.</p>
          <button
            onClick={() => navigate("/products")}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Shop Now
          </button>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Overview */}
          <div className="flex-1 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Product Overview
            </h2>
            <div className="space-y-6 h-[400px] overflow-auto">
              {cart.items.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col md:flex-row items-center gap-4 border-b pb-4"
                >
                  <img
                    src={item.image || "placeholder.jpg"}
                    alt={item.name}
                    className="w-24 h-24 object-contain rounded-md"
                  />
                  <div className="flex-grow">
                    <h3 className="text-gray-800 font-semibold text-lg">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      <span className="font-semibold">Category:</span>{" "}
                      {item.category || "N/A"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <span className="font-semibold">Seller:</span>{" "}
                      {item.seller || "N/A"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <span className="font-semibold">Delivery Estimate:</span>{" "}
                      {item.deliveryDate || "5-7 Days"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-green-600 font-bold text-lg">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="text-gray-500 text-sm">
                      Quantity: {item.quantity}
                    </span>
                    <button
                      onClick={() => dispatch(removeFromCart(item))}
                      className="text-red-500 text-sm hover:underline mt-2"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Details */}
          <div className="w-full md:w-1/3 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800">Payment Details</h2>
            <div className="mt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-green-600 font-semibold">
                  ${cart.totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Shipping:</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Estimated Tax:</span>
                <span className="text-green-600 font-semibold">$0.00</span>
              </div>
              <div className="border-t pt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-800">Total:</span>
                <span className="text-2xl font-bold text-green-600">
                  ${cart.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="mt-6 flex flex-col space-y-4">
              <button
                onClick={handleCheckout}
                className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg text-lg"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={() => dispatch(clearCart(auth.user.id))}
                className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg text-lg"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
