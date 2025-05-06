import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import UserContext  from "../admin/UserContext"; // Adjust import path as needed

function AdminOrderPage() {
  const { cUSer } = useContext(UserContext); // Access current user from context
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  // Ensure cUSer is defined before accessing its properties
  const branchManagerId = cUSer?._id; // Assuming the logged-in user is a branch manager

  useEffect(() => {
    if (!branchManagerId) {
      setMessage("You must be logged in as a branch manager to view orders.");
      return;
    }

    axios
      .get("http://localhost:3001/admin/orders", {
        params: { branchManagerId }, // Pass the branchManagerId
      })
      .then((response) => {
        setOrders(response.data);
        setMessage(""); // Clear any previous messages
      })
      .catch((error) => {
        setMessage(`Error fetching orders: ${error.message}`);
      });
  }, [branchManagerId]);

  // Confirm an order
  const handleConfirmOrder = (orderId) => {
    axios
      .patch(`http://localhost:3001/admin/orders/${orderId}/confirm`)
      .then((response) => {
        setMessage("Order confirmed successfully");
        setOrders(orders.map(order => order._id === orderId ? response.data : order));
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
        setOrders(orders.map(order => order._id === orderId ? response.data : order));
      })
      .catch((error) => setMessage(`Error rejecting order: ${error.message}`));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-md bg-gray-900">
      <h2 className="text-3xl font-bold text-blue-400 mb-6">Manage Orders</h2>
      {message && (
        <p className={`text-lg mb-4 ${message.includes("successfully")
          ? "text-green-500"
          : "text-red-500"
          }`}>
          {message}
        </p>
      )}

      {/* Centered Table Container */}
      <div className="w-full overflow-x-auto"> {/* Remove overflow-x-auto if not needed */}
        <table className="w-full mt-6 border-collapse bg-gray-800 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-700 text-gray-300">
              <th className="px-4 py-2 text-left w-1/12">Customer Name</th>
              <th className="px-4 py-2 text-left w-1/12">Address</th>
              <th className="px-4 py-2 text-left w-1/12">Phone</th>
              <th className="px-4 py-2 text-left w-1/12">Product</th>
              <th className="px-4 py-2 text-left w-1/12">Quantity</th>
              <th className="px-4 py-2 text-left w-1/12">Total Price</th>
              <th className="px-4 py-2 text-left w-1/12">Date Ordered</th>
              <th className="px-4 py-2 text-left w-1/12">Status</th>
              <th className="px-4 py-2 text-left w-1/12">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-600 hover:bg-gray-600 transition duration-300"
                >
                  <td className="px-4 py-2 text-gray-300 truncate">
                    {order.userId?.name || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-300 truncate">
                    {order.userId?.address || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-300 truncate">
                    {order.userId?.phone || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-300 truncate">
                    {order.product?.name || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-300">
                    {order.quantity || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-300">
                    {order.totalPrice || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-gray-300">
                    {new Date(order.dateOrdered).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-gray-300">
                    {order.status || "N/A"}
                  </td>
                  <td className="px-4 py-2 flex flex-col items-center space-y-2">
                    <button
                      onClick={() => handleConfirmOrder(order._id)}
                      className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-500 transition duration-300"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleRejectOrder(order._id)}
                      className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-500 transition duration-300"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="text-center py-4 text-gray-400"
                >
                  No orders available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrderPage;