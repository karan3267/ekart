import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/payment.css";
import { useDispatch, useSelector } from "react-redux";
import { placeOrder } from "../redux/orderSlice";
import { clearCart } from "../redux/cartSlice";
import { setIsPaymentGatewayOpenFalse } from "../redux/utils";
import SuccessAnimation from "../components/SuccessAnimation";

const detectCardType = (number) => {
  const patterns = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/,
  };

  if (patterns.visa.test(number)) return "Visa";
  if (patterns.mastercard.test(number)) return "MasterCard";
  if (patterns.amex.test(number)) return "AmEx";
  if (patterns.discover.test(number)) return "Discover";
  return "";
};

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [cardType, setCardType] = useState("");
  const [upiId, setUpiId] = useState("");
  const [wallet, setWallet] = useState("");
  const [savePaymentInfo, setSavePaymentInfo] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { state } = useLocation();
  const [isSuccess, setIsSuccess] = useState(false);
  const userId = useSelector((state) => state.auth.user.id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getCardStyle = (type) => {
    switch (type) {
      case "Visa":
        return {
          background: "linear-gradient(to right, #1a73e8, #4285f4)",
          icon: "visa.png",
        };
      case "MasterCard":
        return {
          background: "linear-gradient(to right, #ff6f00, #ff9100)",
          icon: "mastercard.png",
        };
      case "AmEx":
        return {
          background: "linear-gradient(to right, #2e8b57, #3cb371)",
          icon: "amex.png",
        };
      case "Discover":
        return {
          background: "linear-gradient(to right, #c71585, #ff69b4)",
          icon: "discover.png",
        };
      default:
        return {
          background: "linear-gradient(to right, #d3d3d3, #a9a9a9)",
          icon: "default_card.png",
        };
    }
  };

  const cardStyle = getCardStyle(cardType);
  if (!state?.products || !state?.customer) {
    return (
      <div className="p-6">
        Invalid payment details. Go back to the checkout page.
      </div>
    );
  }
  const handleCardInputChange = (e) => {
    const { name, value, selectionStart } = e.target;
    if (name === "cardNumber") {
      const rawValue = value.replace(/\D/g, "");
      const formattedValue =
        rawValue
          .slice(0, 16)
          .match(/.{1,4}/g)
          ?.join(" ") || "";

      // Update card type based on raw value
      setCardType(detectCardType(rawValue));

      // Preserve cursor position
      const cursorOffset = formattedValue.length - value.length;
      const newCursorPosition = Math.max(selectionStart + cursorOffset, 0);

      // Update card details and ensure cursor position is correct
      setCardDetails((prev) => ({ ...prev, cardNumber: formattedValue }));

      // Delay is required to set cursor position after React renders the new state
      setTimeout(() => {
        e.target.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    } else {
      setCardDetails({ ...cardDetails, [name]: value });
    }
  };

  const { products, customer } = state;
  const totalPrice = products.reduce(
    (total, product) => total + product.price,
    0
  );

  const handlePayment = () => {
    if (!acceptTerms) {
      alert("Please accept the terms and conditions to proceed.");
      return;
    }

    if (paymentMethod === "card") {
      if (
        !cardDetails.cardNumber ||
        !cardDetails.expiry ||
        !cardDetails.cvv ||
        !cardDetails.name
      ) {
        alert("Please fill in all card details!");
        return;
      }
    } else if (paymentMethod === "upi" && !upiId) {
      alert("Please enter your UPI ID!");
      return;
    } else if (paymentMethod === "wallet" && !wallet) {
      alert("Please select a wallet!");
      return;
    }
    //todo: processing screen
    setIsSuccess(true);
    //todo: update address
    try {
      dispatch(
        placeOrder({
          items: products,
          shippingAddress: "",
          totalAmount: totalPrice,
          paymentMethod: paymentMethod,
          paymentStatus: "Paid",
        })
      );
      dispatch(clearCart(userId));
      setTimeout(() => {
        dispatch(setIsPaymentGatewayOpenFalse());
        navigate("/");
      }, 4000);
    } catch (error) {
      alert(
        "An error occured during payment please try again. Error: " + error
      );
    }
  };
  const handleMouseEnter = (e) => {
    e.preventDefault();
    setIsHovering(true);
  };
  const handleMouseLeave = (e) => {
    e.preventDefault();
    setIsHovering(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-20 bg-white rounded-lg shadow-lg p-6 my-6"
      >
        {/* Product Overview */}
        <div className="overflow-y-auto max-h-[720px]">
          <motion.div
            className="space-y-4"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <a
                className="flex items-center"
                href="/cancel"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <svg
                  height="20px"
                  id="Layer_1"
                  style={{ enableBackground: "new 0 0 512 512" }}
                  version="1.1"
                  viewBox="0 0 512 512"
                  width="20px"
                  xmlSpace="preserve"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  <polygon points="352,128.4 319.7,96 160,256 160,256 160,256 319.7,416 352,383.6 224.7,256 " />
                </svg>
                {!isHovering && (
                  <div className="p-1 rounded-full border-2">
                    <svg
                      viewBox="0 0 32 32"
                      xmlns="http://www.w3.org/2000/svg"
                      height="20px"
                      width="20px"
                    >
                      <defs>
                        <style>{`.cls-1 { fill: none; }`}</style>
                      </defs>
                      <title />
                      <g id="Layer_2" data-name="Layer 2">
                        <path d="M24,29H8a3,3,0,0,1-3-3V16a1,1,0,0,1,2,0V26a1,1,0,0,0,1,1H24a1,1,0,0,0,1-1V16a1,1,0,0,1,2,0V26A3,3,0,0,1,24,29Z" />
                        <path d="M15,29H10a1,1,0,0,1-1-1V22a3,3,0,0,1,3-3h1a3,3,0,0,1,3,3v6A1,1,0,0,1,15,29Zm-4-2h3V22a1,1,0,0,0-1-1H12a1,1,0,0,0-1,1Z" />
                        <path d="M25,17a4,4,0,0,1-4-4,1,1,0,0,1,2,0,2,2,0,0,0,4,0v-.76L24.38,7H7.62L5,12.24V13a2,2,0,0,0,4,0,1,1,0,0,1,2,0,4,4,0,0,1-8,0V12a1,1,0,0,1,.11-.45l3-6A1,1,0,0,1,7,5H25a1,1,0,0,1,.89.55l3,6A1,1,0,0,1,29,12v1A4,4,0,0,1,25,17Z" />
                        <path d="M13,17a4,4,0,0,1-4-4,1,1,0,0,1,2,0,2,2,0,0,0,4,0,1,1,0,0,1,2,0A4,4,0,0,1,13,17Z" />
                        <path d="M19,17a4,4,0,0,1-4-4,1,1,0,0,1,2,0,2,2,0,0,0,4,0,1,1,0,0,1,2,0A4,4,0,0,1,19,17Z" />
                        <path d="M22,22H19a1,1,0,0,1,0-2h3a1,1,0,0,1,0,2Z" />
                      </g>
                      <g id="frame">
                        <rect className="cls-1" height="24" width="24" />
                      </g>
                    </svg>
                  </div>
                )}
                {isHovering && <p>Back</p>}
              </a>
            </div>
            <h2 className="text-2xl font-bold text-gray-700">Order Summary</h2>
            <p className="text-lg font-bold mt-4 text-gray-800">
              Total: ${totalPrice}
            </p>
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center gap-4 bg-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 object-contain rounded-lg"
                  />
                  <div>
                    <h3 className="font-bold text-gray-700">{product.name}</h3>
                    <p className="text-sm text-gray-500">
                      Quantity: {product.quantity}
                    </p>
                    <p className="text-sm text-gray-500">
                      Price: ${product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Payment Form */}
        <motion.div
          className="bg-gradient-to-br from-blue-500 via-blue-700 to-gray-800 text-white p-6 rounded-lg"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setPaymentMethod("card")}
              className={`p-3 w-1/3 rounded-lg font-bold ${
                paymentMethod === "card"
                  ? "bg-white text-blue-500"
                  : "bg-blue-600 hover:bg-blue-500"
              }`}
            >
              Card
            </button>
            <button
              onClick={() => setPaymentMethod("upi")}
              className={`p-3 w-1/3 rounded-lg font-bold ${
                paymentMethod === "upi"
                  ? "bg-white text-blue-500"
                  : "bg-blue-600 hover:bg-blue-500"
              }`}
            >
              UPI
            </button>
            <button
              onClick={() => setPaymentMethod("wallet")}
              className={`p-3 w-1/3 rounded-lg font-bold ${
                paymentMethod === "wallet"
                  ? "bg-white text-blue-500"
                  : "bg-blue-600 hover:bg-blue-500"
              }`}
            >
              Wallet
            </button>
          </div>
          <div className="">
            {paymentMethod === "card" && (
              <div className="bg-white text-gray-800 p-4 rounded-lg mt-24">
                {/* Virtual Card */}
                <div
                  className="relative top-0 right-20 mb-4 w-64 h-36 rounded-lg p-4 shadow-lg"
                  style={{ background: cardStyle.background }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <img
                      src={cardStyle.icon}
                      alt={cardType}
                      className="w-12 h-12 object-contain"
                    />
                    <span className="text-sm text-white">{cardType}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-widest">
                    {cardDetails.cardNumber || "#### #### #### ####"}
                  </h3>
                  <div className="flex justify-between mt-2">
                    <p className="text-sm text-gray-300">
                      {cardDetails.name || "Name"}
                    </p>
                    <p className="text-sm text-gray-300">
                      {cardDetails.expiry || "MM/YY"}
                    </p>
                  </div>
                </div>

                {/* Card Input Fields */}
                <h3 className="text-lg font-bold mb-2">Enter Card Details</h3>
                <div className="mt-10">
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Card Number"
                    value={cardDetails.cardNumber}
                    onChange={handleCardInputChange}
                    className="p-3 border rounded-lg w-full mb-4 shadow-sm"
                  />
                  <input
                    type="text"
                    name="name"
                    placeholder="Name on Card"
                    value={cardDetails.name}
                    onChange={handleCardInputChange}
                    className="p-3 border rounded-lg w-full mb-4 shadow-sm"
                  />
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      name="expiry"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={handleCardInputChange}
                      className="p-3 border rounded-lg w-1/2 shadow-sm"
                    />
                    <input
                      type="password"
                      name="cvv"
                      placeholder="CVV"
                      value={cardDetails.cvv}
                      onChange={handleCardInputChange}
                      className="p-3 border rounded-lg w-1/2 shadow-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "upi" && (
              <div className="bg-white text-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Enter UPI ID</h3>
                <input
                  type="text"
                  placeholder="e.g., user@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="p-3 border rounded-lg w-full shadow-sm"
                />
              </div>
            )}

            {paymentMethod === "wallet" && (
              <div className="bg-white text-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Choose Wallet</h3>
                <select
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  className="p-3 border rounded-lg w-full shadow-sm"
                >
                  <option value="">Select Wallet</option>
                  <option value="paypal">PayPal</option>
                  <option value="googlePay">Google Pay</option>
                  <option value="amazonPay">Amazon Pay</option>
                </select>
              </div>
            )}

            {/* Save Payment Info */}
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                checked={savePaymentInfo}
                onChange={() => setSavePaymentInfo(!savePaymentInfo)}
                className="w-4 h-4 mr-2"
              />
              <span>Save payment information for future use</span>
            </div>

            {/* Terms and Conditions */}
            <div className="mt-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">
                  I accept the{" "}
                  <a href="#" className="text-blue-200 underline">
                    terms and conditions
                  </a>
                  .
                </span>
              </label>
            </div>
          </div>

          {/* Pay Now Button */}
          <motion.div
            className=" mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={handlePayment}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 shadow-md"
            >
              Pay Now
            </button>
          </motion.div>
        </motion.div>
        {isSuccess && (
          <SuccessAnimation
            text={"Your order has been placed successfully."}
            header={"Payment Successful!"}
          />
        )}
      </motion.div>
    </div>
  );
};

export default PaymentPage;
