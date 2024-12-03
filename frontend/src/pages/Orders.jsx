import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../redux/orderSlice";
import "../styles/order.css";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, error } = useSelector((state) => state.order);
  const navigate = useNavigate();

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ORDERS_PER_PAGE = 10;

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    let filtered = orders;

    // Apply filter based on selection
    if (filter === "last30Days") {
      const date30DaysAgo = new Date();
      date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);
      filtered = orders.filter(
        (order) => new Date(order.createdAt) >= date30DaysAgo
      );
    } else if (filter === "lastYear") {
      const lastYear = new Date().getFullYear() - 1;
      filtered = orders.filter(
        (order) => new Date(order.createdAt).getFullYear() === lastYear
      );
    }

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to the first page when filters change
  }, [filter, orders]);

  const totalOrders = filteredOrders.length;
  const totalPages = Math.ceil(totalOrders / ORDERS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-screen text-red-500">
        <h1 className="text-2xl font-bold">Error Fetching Orders</h1>
        <p className="text-lg mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Orders</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded-lg bg-white shadow-sm"
        >
          <option value="all">All Orders</option>
          <option value="last30Days">Last 30 Days</option>
          <option value="lastYear">Last Year</option>
        </select>
      </div>

      {/* Orders List */}
      {paginatedOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-500 h-full">
          <img
            src={"default_product.png"}
            alt="No Orders"
            className="w-40 mb-4"
          />
          <h2 className="text-lg font-medium">No Orders Found</h2>
        </div>
      ) : (
        <div className="space-y-6">
          {paginatedOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-md rounded-lg p-6 border"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    Order #{order._id}
                  </h2>
                  <p className="text-gray-600">
                    Ordered on:{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    Total: ${order.totalAmount.toFixed(2)}
                  </p>
                  <p className={`mt-1 text-sm font-medium`}>
                    Status:{" "}
                    <span
                      className={`px-2 py-1 rounded ${
                        order.orderStatus === "Completed"
                          ? "bg-green-100 text-green-600"
                          : order.orderStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/order/${order._id}`)}
                  className="text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  View Details
                </button>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center border-t pt-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="text-gray-800 font-medium">{item.name}</h3>
                      <p className="text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-gray-600">
                        Price: ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded ${
                page === currentPage
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;
