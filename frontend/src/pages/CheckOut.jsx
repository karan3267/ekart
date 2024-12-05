import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCustomer } from "../redux/paymentSlice";
import { setIsPaymentGatewayOpenTrue } from "../redux/utils";
import "../styles/checkout.css"; 

const CheckOut = () => {
  const products = useSelector((state) => state.payment.products);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: "",
  });
  const [gateway, setGateway] = useState("custom");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!products || products.length === 0) {
      navigate("/cart");
    }
  }, [products, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.address) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error on input change
  };

  const handleProceedToPayment = () => {
    if (!validateForm()) return;

    dispatch(setCustomer(formData));
    dispatch(setIsPaymentGatewayOpenTrue());

    if (gateway === "custom") {
      navigate("/custom-payment", { state: { products, customer: formData } });
    } else if (gateway === "stripe") {
      navigate("/payment");
    } else if (gateway === "razorpay") {
      navigate("/razorpay-payment");
    }
  };

  const totalPrice = products.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  return (
    <div className="checkout-page">
      <h1 className="text-3xl font-bold text-center mb-6">Checkout</h1>
      <div className="checkout-grid">
        {/* Order Summary */}
        <div className="order-summary h-[300px] md:h-[540px] overflow-auto">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <p className="text-lg font-bold mt-4">Total: ${totalPrice}</p>
          <div className="order-items">
            {products.map((product) => (
              <div
                key={product._id}
                className="flex items-center gap-4 border-b py-4"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-contain rounded"
                />
                <div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600">
                    Quantity: {product.quantity}
                  </p>
                  <p className="text-sm text-gray-600">
                    Price: ${product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Information */}
        <div className="checkout-details">
          <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              className={`input ${errors.name ? "input-error" : ""}`}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              className={`input ${errors.email ? "input-error" : ""}`}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          <div className="form-group">
            <textarea
              name="address"
              placeholder="Shipping Address"
              value={formData.address}
              onChange={handleInputChange}
              className={`input ${errors.address ? "input-error" : ""}`}
            />
            {errors.address && <p className="error-text">{errors.address}</p>}
          </div>

          {/* Payment Gateway Selection */}
          <h2 className="text-xl font-bold mb-4">Payment Method</h2>
          <div className="payment-options">
            <label className="gateway-option">
              <input
                type="radio"
                name="gateway"
                value="custom"
                checked={gateway === "custom"}
                onChange={(e) => setGateway(e.target.value)}
              />
              Custom Gateway
            </label>
            <label className="gateway-option">
              <input
                type="radio"
                name="gateway"
                value="stripe"
                onChange={(e) => setGateway(e.target.value)}
              />
              Stripe
            </label>
            <label className="gateway-option">
              <input
                type="radio"
                name="gateway"
                value="razorpay"
                onChange={(e) => setGateway(e.target.value)}
              />
              Razorpay
            </label>
          </div>

          {/* Proceed Button */}
          <button
            onClick={handleProceedToPayment}
            className="btn-primary w-full mt-4"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
