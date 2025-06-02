import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import UserContext from "../admin/UserContext";

function OrderHistory() {
  const { cUSer } = useContext(UserContext);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/orders?userId=${cUSer._id}&sort=-createdAt`
        );

        const uniqueOrders = Array.from(
          new Map(response.data.map((order) => [order._id, order])).values()
        );

        setOrderHistory(uniqueOrders);
      } catch (error) {
        console.error("Error fetching order history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (cUSer?._id) {
      fetchOrderHistory();
    }
  }, [cUSer]);

  const filteredOrders = orderHistory.filter(
    (order) =>
      order.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <p className="text-center text-gray-300 mt-10">
        Loading order history...
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 rounded-lg shadow-md bg-gray-900 min-h-screen">
      <h3 className="text-xl font-semibold text-blue-400 mt-10">Order History</h3>
      <div className="mt-4">
        <input
          type="text"
          placeholder="Search by product name or status"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 p-3 bg-gray-800 border border-gray-600 rounded-md text-white"
        />
      </div>

      <div className="overflow-x-auto mt-6">
        <table className="min-w-full table-auto border-collapse bg-gray-800 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-700 text-gray-300">
              <th className="px-4 py-2">Product Name</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Total Price</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <tr key={index} className="border-b border-gray-600">
                  <td className="px-4 py-2 text-gray-300">
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
                  <td
                    className={`px-4 py-2 text-gray-300 ${
                      order.status === "Confirmed"
                        ? "text-blue-500"
                        : order.status === "Rejected"
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {order.status || "Pending"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-400">
                  {orderHistory.length === 0
                    ? "No orders placed"
                    : "No matching orders found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <Link
          to="/user/Userpage"
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Back to Order Page
        </Link>
      </div>
    </div>
  );
}

export default OrderHistory;