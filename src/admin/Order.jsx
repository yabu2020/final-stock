import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import  UserContext  from "../admin/UserContext"; // Adjust import path as needed

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
    <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-md bg-white">
      <h2 className="text-3xl font-bold text-blue-400 mb-6">Manage Orders</h2>
      {message && <p className="text-red-500 text-lg mb-4">{message}</p>}

      <table className="w-full mt-6 border-collapse bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-blue-100 text-blue-400">
            <th className="px-4 py-2">Customer Name</th>
            <th className="px-4 py-2">Address</th>
            <th className="px-4 py-2">Phone</th>
            <th className="px-4 py-2">Product</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Total Price</th>
            <th className="px-4 py-2">Date Ordered</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="px-4 py-2">{order.userId?.name || "N/A"}</td>
                <td className="px-4 py-2">{order.userId?.address || "N/A"}</td>
                <td className="px-4 py-2">{order.userId?.phone || "N/A"}</td>
                <td className="px-4 py-2">{order.product?.name || "N/A"}</td>
                <td className="px-4 py-2">{order.quantity || "N/A"}</td>
                <td className="px-4 py-2">{order.totalPrice || "N/A"}</td>
                <td className="px-4 py-2">{new Date(order.dateOrdered).toLocaleDateString()}</td>
                <td className="px-4 py-2">{order.status || "N/A"}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleConfirmOrder(order._id)}
                    className="px-4 py-2 bg-blue-400 text-white font-semibold rounded-md shadow-md hover:bg-blue-500 transition duration-300 mr-2"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleRejectOrder(order._id)}
                    className="px-4 py-2 bg-red-400 text-white font-semibold rounded-md shadow-md hover:bg-red-500 transition duration-300"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center py-4 text-blue-500">
                No orders available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOrderPage;