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
    if (auth.user !== null && auth.user !== undefined) {
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
        <p className="text-gray-500 text-lg">Your cart is empty.</p>
      ) : (
        <>
          {/* Product Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-center">Quantity</th>
                  <th className="px-4 py-2 text-right">Price</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b hover:bg-gray-100 transition-colors"
                  >
                    <td className="px-4 py-3 flex items-center space-x-4">
                      <img
                        src={item.image || "placeholder.jpg"}
                        alt={item.name}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <span className="text-gray-800 font-medium">
                        {item.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">{item.quantity}</td>
                    <td className="px-4 py-3 text-right font-semibold text-green-600">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => dispatch(removeFromCart(item))}
                        className="text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cart Summary */}
          <div className="mt-8 flex flex-col items-center md:items-end">
            <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-1/3">
              <h2 className="text-xl font-bold text-gray-800">Cart Summary</h2>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-gray-600">Total:</span>
                <span className="text-2xl font-bold text-green-600">
                  ${cart.totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={handleCheckout}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg w-full text-center"
                >
                  Checkout
                </button>
                <button
                  onClick={() => dispatch(clearCart(auth.user.id))}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg w-full text-center"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
