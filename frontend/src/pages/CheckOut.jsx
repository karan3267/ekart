import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCustomer } from "../redux/paymentSlice";
import { setIsPaymentGatewayOpen } from "../redux/utils";

const CheckOut = () => {
  const products = useSelector((state) => state.payment.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [gateway, setGateway] = useState("custom"); // Default to custom gateway

  if (!products || products.length === 0) {
    return <div className="p-6">No products in the cart. Go back and add some products.</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProceedToPayment = () => {
    if (!formData.name || !formData.email || !formData.address) {
      alert("Please fill in all fields.");
      return;
    }
    dispatch(setCustomer(formData));
    dispatch(setIsPaymentGatewayOpen());
    // Navigate to the selected payment gateway
    if (gateway === "custom") {
      navigate("/custom-payment", { state: { products, customer: formData } });
    } else if (gateway === "stripe") {
      navigate("/payment"); // Example: Stripe integration page
    } else if (gateway === "razorpay") {
      navigate("/razorpay-payment"); // Example: Razorpay integration page
    }
  };

  const totalPrice = products.reduce((total, product) => total + product.totalPrice, 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {/* Products Table */}
      <div className="mb-6">
        <h2 className="text-lg font-bold">Order Summary</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Product</th>
              <th className="border border-gray-300 px-4 py-2">Quantity</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                <td className="border border-gray-300 px-4 py-2">{product.quantity}</td>
                <td className="border border-gray-300 px-4 py-2">${product.totalPrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-lg font-bold mt-4">Total: ${totalPrice.toFixed(2)}</p>
      </div>

      {/* Shipping Information */}
      <div className="mb-6">
        <h2 className="text-lg font-bold">Shipping Information</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          className="p-2 border rounded w-full mb-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          className="p-2 border rounded w-full mb-2"
        />
        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleInputChange}
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Payment Gateway Selection */}
      <div className="mb-6">
        <h2 className="text-lg font-bold">Select Payment Gateway</h2>
        <select
          value={gateway}
          onChange={(e) => setGateway(e.target.value)}
          className="p-2 border rounded w-full"
        >
          <option value="custom">Custom Gateway</option>
          <option value="stripe">Stripe</option>
          <option value="razorpay">Razorpay</option>
        </select>
      </div>

      {/* Proceed Button */}
      <button
        onClick={handleProceedToPayment}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default CheckOut;
