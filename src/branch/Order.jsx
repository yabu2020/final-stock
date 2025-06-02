import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import UserContext from "../admin/UserContext";

function AdminOrderPage() {
  const { cUSer } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const branchManagerId = cUSer?._id;

  useEffect(() => {
    if (!cUSer) return;

    if (!branchManagerId) {
      setMessage("You must be logged in as a branch manager to view orders.");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3001/admin/orders", {
          params: { branchManagerId },
        });

        if (Array.isArray(response.data) && response.data.length === 0) {
          setMessage("No orders available.");
        } else {
          setOrders(response.data);
          setMessage("");
        }
      } catch (error) {
        setMessage(`Error fetching orders: ${error.response?.data?.error || error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [cUSer, branchManagerId]);

  const handleConfirmOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to confirm this order?")) {
      return;
    }

    try {
      setMessage("Confirming order...");
      const response = await axios.patch(
        `http://localhost:3001/admin/orders/${orderId}/confirm`
      );

      setMessage("Order confirmed successfully");
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === orderId ? response.data : order))
      );
    } catch (error) {
      const hasStockIssue = error.response?.data?.details?.available !== undefined;
      if (hasStockIssue) {
        const { available, requested } = error.response.data.details;
        setMessage(`Insufficient stock (Available: ${available}, Requested: ${requested})`);
      } else {
        setMessage("Something went wrong while confirming the order.");
      }
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      setMessage("Rejecting order...");
      const response = await axios.patch(
        `http://localhost:3001/admin/orders/${orderId}/reject`
      );

      setMessage("Order rejected successfully");
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === orderId ? response.data : order))
      );
    } catch (error) {
      setMessage(`Error rejecting order: ${error.response?.data?.error || error.message}`);
    }
  };

  const isActionDisabled = (status) => status === "Confirmed" || status === "Rejected";

  const filteredOrders = orders.filter((order) => {
    const customer = order.userId?.name?.toLowerCase() || "";
    const product = order.product?.name?.toLowerCase() || "";
    const status = order.status?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();

    return (
      customer.includes(term) ||
      product.includes(term) ||
      status.includes(term)
    );
  });

  if (!cUSer) {
    return (
      <div className="text-center mt-10 text-red-400">
        Loading user info or unauthorized access.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 rounded-lg shadow-md bg-gray-900">
      <h2 className="text-3xl font-bold text-blue-400 mb-6">Manage Orders</h2>

      {message && (
        <p
          className={`text-lg mb-4 ${
            message.includes("successfully") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by customer, product, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <p className="text-gray-400 text-center">Loading orders...</p>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full mt-6 border-collapse bg-gray-800 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-700 text-gray-300">
                <th className="px-4 py-2 text-left">Customer Name</th>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Total Price</th>
                <th className="px-4 py-2 text-left">Date Ordered</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className={`border-b border-gray-600 hover:bg-gray-600 transition duration-300 ${
                      order.status === 'Confirmed' ? 'bg-green-900 bg-opacity-30' :
                      order.status === 'Rejected' ? 'bg-red-900 bg-opacity-30' : ''
                    }`}
                  >
                    <td className="px-4 py-2 text-gray-300">{order.userId?.name || "N/A"}</td>
                    <td className="px-4 py-2 text-gray-300">{order.userId?.address || "N/A"}</td>
                    <td className="px-4 py-2 text-gray-300">{order.userId?.phone || "N/A"}</td>
                    <td className="px-4 py-2 text-gray-300">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="truncate max-w-[120px]">{order.product?.name || "N/A"}</span>
                        {order.product && (
                          <span className={`px-2 py-0.5 text-xs rounded-full whitespace-nowrap ${
                            order.product.status === 'Available' ? 'bg-green-900 text-green-300' :
                            order.product.status === 'Low Stock' ? 'bg-yellow-900 text-yellow-300' :
                            'bg-red-900 text-red-300'
                          }`}>
                            {order.product.quantity} left
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-gray-300">{order.quantity || "N/A"}</td>
                    <td className="px-4 py-2 text-gray-300">${order.totalPrice?.toFixed(2) || "N/A"}</td>
                    <td className="px-4 py-2 text-gray-300">
                      {new Date(order.dateOrdered).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-gray-300">
                      {order.status || "N/A"}
                      {order.confirmedAt && (
                        <div className="text-xs text-gray-400">
                          Confirmed: {new Date(order.confirmedAt).toLocaleString()}
                        </div>
                      )}
                      {order.rejectedAt && (
                        <div className="text-xs text-gray-400">
                          Rejected: {new Date(order.rejectedAt).toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2 flex flex-col items-center space-y-2">
                      <button
                        onClick={() => handleConfirmOrder(order._id)}
                        disabled={isActionDisabled(order.status)}
                        className={`w-full px-4 py-2 text-white font-semibold rounded-md shadow-md transition duration-300 ${
                          isActionDisabled(order.status)
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-500"
                        }`}
                        title={isActionDisabled(order.status) ? "Order already processed" : ""}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleRejectOrder(order._id)}
                        disabled={isActionDisabled(order.status)}
                        className={`w-full px-4 py-2 text-white font-semibold rounded-md shadow-md transition duration-300 ${
                          isActionDisabled(order.status)
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-500"
                        }`}
                        title={isActionDisabled(order.status) ? "Order already processed" : ""}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-gray-400">
                    No matching orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminOrderPage;