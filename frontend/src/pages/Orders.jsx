import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../redux/orderSlice";
import "../styles/order.css"

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <h1 className="text-xl font-bold">Error Fetching Orders</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      {orders.length === 0 ? (
        <div className="flex flex-col items-center text-gray-500">
          <img
            src="/images/no-orders.svg"
            alt="No Orders"
            className="w-40 mb-4"
          />
          <h2 className="text-lg font-medium">No Orders Found</h2>
          <p>Start shopping and place your first order!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden shadow-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="text-left px-6 py-3">Order ID</th>
                <th className="text-left px-6 py-3">Total Amount</th>
                <th className="text-left px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="px-6 py-4 border-b text-gray-700">
                    {order._id}
                  </td>
                  <td className="px-6 py-4 border-b text-gray-700">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 border-b">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.orderStatus === "Completed"
                          ? "bg-green-100 text-green-600"
                          : order.orderStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
