import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import UserContext from "../admin/UserContext"; // Adjust if needed

function AdminOrderPage() {
  const { cUSer } = useContext(UserContext); // Context for current user
  const [orders, setOrders] = useState([]);
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

    axios
      .get("http://localhost:3001/admin/orders", {
        params: { branchManagerId },
      })
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length === 0) {
          setMessage("No orders available.");
        } else {
          setOrders(response.data);
          setMessage("");
        }
        setLoading(false);
      })
      .catch((error) => {
        setMessage(`Error fetching orders: ${error.response?.data?.error || error.message}`);
        setLoading(false);
      });
  }, [cUSer]);

  const handleConfirmOrder = (orderId) => {
    axios
      .patch(`http://localhost:3001/admin/orders/${orderId}/confirm`)
      .then((response) => {
        setMessage("Order confirmed successfully");
        setOrders((prevOrders) =>
          prevOrders.map((order) => (order._id === orderId ? response.data : order))
        );
      })
      .catch((error) => {
        setMessage(`Error confirming order: ${error.response?.data?.error || error.message}`);
      });
  };

  const handleRejectOrder = (orderId) => {
    axios
      .patch(`http://localhost:3001/admin/orders/${orderId}/reject`)
      .then((response) => {
        setMessage("Order rejected successfully");
        setOrders((prevOrders) =>
          prevOrders.map((order) => (order._id === orderId ? response.data : order))
        );
      })
      .catch((error) => {
        setMessage(`Error rejecting order: ${error.response?.data?.error || error.message}`);
      });
  };

  const isActionDisabled = (status) => status === "Confirmed" || status === "Rejected";

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
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-600 hover:bg-gray-600 transition duration-300"
                  >
                    <td className="px-4 py-2 text-gray-300">{order.userId?.name || "N/A"}</td>
                    <td className="px-4 py-2 text-gray-300">{order.userId?.address || "N/A"}</td>
                    <td className="px-4 py-2 text-gray-300">{order.userId?.phone || "N/A"}</td>
                    <td className="px-4 py-2 text-gray-300">{order.product?.name || "N/A"}</td>
                    <td className="px-4 py-2 text-gray-300">{order.quantity || "N/A"}</td>
                    <td className="px-4 py-2 text-gray-300">{order.totalPrice || "N/A"}</td>
                    <td className="px-4 py-2 text-gray-300">
                      {new Date(order.dateOrdered).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-gray-300">{order.status || "N/A"}</td>
                    <td className="px-4 py-2 flex flex-col items-center space-y-2">
                      <button
                        onClick={() => handleConfirmOrder(order._id)}
                        disabled={isActionDisabled(order.status)}
                        className={`w-full px-4 py-2 text-white font-semibold rounded-md shadow-md transition duration-300 ${
                          isActionDisabled(order.status)
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-500"
                        }`}
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
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-gray-400">
                    No orders available
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
