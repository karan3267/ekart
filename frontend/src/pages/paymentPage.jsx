import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/payment.css";
import { useDispatch, useSelector } from "react-redux";
import { placeOrder } from "../redux/orderSlice";
import { clearCart } from "../redux/cartSlice";
import { setIsPaymentGatewayOpenFalse } from "../redux/utils";
import SuccessAnimation from "../components/SuccessAnimation";

const detectCardType = (number) => {
  const patterns = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard: /^5[1-5][0-9]{14}$/,
    amex: /^3[47][0-9]{13}$/,
    discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
    diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    jcb: /^(?:2131|1800|35\d{3})\d{11}$/,
    unionpay: /^(62|81)[0-9]{14,17}$/,
    maestro: /^(5018|5020|5038|5893|6304|6759|676[1-3])[0-9]{8,15}$/,
    mir: /^220[0-4][0-9]{12}$/,
    elo: /^((506699|5067[0-9]{2}|509[0-9]{3})|(636368|636297|504175|438935|40117[8-9]|45763[1-2]|457393))[0-9]{10,12}$/,
    rupay: /^(60|6521|6522)[0-9]{12,15}$/,
  };
  for (const [key, pattern] of Object.entries(patterns)) {
    if (pattern.test(number)) {
      return key.charAt(0).toUpperCase() + key.slice(1);
    }
  }
  return "Unknown";
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
  const [expiryError, setExpiryError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = () => {
    navigate("/");
    dispatch(setIsPaymentGatewayOpenFalse());
  };

  const getCardStyle = (type) => {
    const styles = {
      Visa: {
        background: "linear-gradient(to right, #1a1f71, #004b87)",
        icon: "icons/visa.png",
      },
      Mastercard: {
        background: "linear-gradient(to right, #f79e1b,#eb001b)",
        icon: "icons/mastercard.png",
      },
      Amex: {
        background: "linear-gradient(to right, #007bc1, #005587)",
        icon: "icons/amex.png",
      },
      Discover: {
        background: "linear-gradient(to right, #f76f00, #f9a602)",
        icon: "icons/discover.png",
      },
      Diners: {
        background: "linear-gradient(to right, #006272, #00b1b7)",
        icon: "icons/diners.png",
      },
      Jcb: {
        background: "linear-gradient(to right, #003a66, #4a8cca)",
        icon: "icons/jcb.png",
      },
      Unionpay: {
        background: "linear-gradient(to right, #dc241f, #00a1e9)",
        icon: "icons/unionpay.png",
      },
      Maestro: {
        background: "linear-gradient(to right, #cc2131, #019fdc)",
        icon: "icons/maestro.png",
      },
      Mir: {
        background: "linear-gradient(to right, #00794c, #00a550)",
        icon: "icons/mir.png",
      },
      Elo: {
        background: "linear-gradient(to right, #ffcb05, #000000)",
        icon: "icons/elo.png",
      },
      Rupay: {
        background: "linear-gradient(to right, #0079c1,#5f259f)",
        icon: "icons/rupay.png",
      },
      Default: {
        background: "linear-gradient(to right, #d3d3d3, #a9a9a9)",
        icon: "icons/default_card.png",
      },
    };

    return styles[type] || styles.Default;
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
    const { name, value } = e.target;
    if (name === "expiry") {
      const sanitizedValue = value.replace(/[^0-9/]/g, "");
      let formattedValue = sanitizedValue;

      if (sanitizedValue.length === 1 && sanitizedValue > 1) {
        formattedValue = `0${sanitizedValue}/`; // Automatically prepend '0' if month > 1
      } else if (sanitizedValue.length === 2 && !sanitizedValue.includes("/")) {
        formattedValue = `${sanitizedValue}/`; // Add '/' after two digits
      } else if (sanitizedValue.length > 5) {
        formattedValue = sanitizedValue.slice(0, 5); // Limit length to MM/YY
      }
      setExpiryError(!validateExpiry(formattedValue));
      setCardDetails((prev) => ({
        ...prev,
        expiry: formattedValue,
      }));
      return;
    }
    if (name === "cvv") {
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 3);
      setCardDetails((prev) => ({
        ...prev,
        cvv: sanitizedValue,
      }));
      return;
    }
    if (name === "cardNumber") {
      const rawValue = value.replace(/\D/g, "");

      const limitedValue = rawValue.slice(0, 16);

      const formattedValue = limitedValue.match(/.{1,4}/g)?.join(" ") || "";

      setCardType(detectCardType(limitedValue));

      setCardDetails((prev) => ({
        ...prev,
        cardNumber: formattedValue,
      }));
    } else {
      setCardDetails((prev) => ({ ...prev, [name]: value }));
    }
  };
  const validateExpiry = (expiry) => {
    const [month, year] = expiry.split("/").map(Number);

    if (!month || !year || month < 1 || month > 12) {
      return false;
    }

    const currentYear = new Date().getFullYear() % 100; // Get last two digits of current year
    const currentMonth = new Date().getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false; // Expiry date is in the past
    }

    return true;
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
        !validateExpiry(cardDetails.expiry) ||
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-20 bg-white rounded-lg shadow-lg p-6 my-6"
      >
        {/* Product Overview */}
        <div className="h-[400px] md:h-[720px]">
          <motion.div
            className="space-y-4"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <div
                className="flex items-center hover:cursor-pointer"
                onClick={handleClick}
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
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-700">Order Summary</h2>
            <p className="text-lg font-bold mt-4 text-gray-800">
              Total: ${totalPrice}
            </p>
            <div className="h-[300px] md:h-[600px] overflow-y-auto bg-gray-100 px-3 py-4 rounded-lg">
              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24 object-contain rounded-lg"
                    />
                    <div>
                      <h3 className="font-bold text-gray-700">
                        {product.name}
                      </h3>
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
              <div className="bg-white text-gray-800 p-4 rounded-lg relative mt-10">
                {/* Virtual Card */}
                <div
                  className="md:relative top-0 right-20 mb-4 w-64 h-36 rounded-lg p-4 shadow-lg"
                  style={{ background: cardStyle.background }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <img
                      src={cardStyle.icon}
                      alt={cardType}
                      className="w-12 h-12 object-contain"
                    />
                    <span className="text-sm text-white font-medium">
                      {cardType !== "Unknown" ? cardType : ""}
                    </span>
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
                <h3 className="text-lg font-bold mb-2 mt-6">
                  Enter Card Details
                </h3>
                <div>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Card Number"
                    value={cardDetails.cardNumber}
                    onChange={handleCardInputChange}
                    maxLength={19}
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
                  {expiryError && (
                    <span className="text-red-600">
                      * please enter valid expiry date
                    </span>
                  )}
                  <div className="flex space-x-4 ">
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
                      maxLength={3}
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
