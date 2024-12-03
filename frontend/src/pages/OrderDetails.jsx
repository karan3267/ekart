import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// import "../styles/orderDetails.css";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders } = useSelector((state) => state.order);

  // Find the specific order
  const order = orders.find((o) => o._id === orderId);

  if (!order) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-bold text-red-500">Order Not Found</h1>
        <button
          onClick={() => navigate("/orders")}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Order Details</h1>

      {/* Order Summary */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-medium text-gray-800">{order._id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Order Date:</span>
            <span className="font-medium text-gray-800">
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-medium text-gray-800">
              {order.paymentMethod}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Status:</span>
            <span
              className={`font-medium px-3 py-1 rounded-lg ${
                order.paymentStatus === "Paid"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Order Status:</span>
            <span
              className={`font-medium px-3 py-1 rounded-lg ${
                order.orderStatus === "Completed"
                  ? "bg-green-100 text-green-600"
                  : order.orderStatus === "Processing"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {order.orderStatus}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-bold text-green-600 text-xl">
              ${order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800">Order Items</h2>
        <div className="mt-4 space-y-4">
          {order.orderItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 border-b pb-4 last:border-b-0"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-contain rounded-lg"
              />
              <div className="flex-grow">
                <h3 className="text-gray-800 font-semibold">{item.name}</h3>
                <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                <p className="text-gray-600 text-sm">Price: ${item.price}</p>
              </div>
              <div className="font-bold text-green-600 text-lg">
                ${item.price * item.quantity}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate("/orders")}
        className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
      >
        Back to Orders
      </button>
    </div>
  );
};

export default OrderDetails;
