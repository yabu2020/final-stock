import React, { useState } from "react";
import { Link } from "react-router-dom";

// Sample user data
const userData = {
  firstName: "David",
  lastName: "Dink",
  username: "davidheree",
  email: "davidheree@email.com",
  mobilePhone: "+50 123 456 78",
  whatsapp: "+50 444 555 111",
  address: "123 Main Street",
  city: "New York",
  country: "USA",
};

// Sample order history data
const orderHistory = [
  {
    orderId: "#12345",
    date: "2023-10-01",
    total: "$120.50",
    status: "Delivered",
  },
  {
    orderId: "#12346",
    date: "2023-09-28",
    total: "$85.00",
    status: "Shipped",
  },
  {
    orderId: "#12347",
    date: "2023-09-25",
    total: "$200.00",
    status: "Processing",
  },
];

function CDashboard() {
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState(userData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Main Content Area */}
      <div className="flex-grow p-4">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg shadow p-4 mb-4">
          <h2 className="text-2xl font-semibold mb-2">Customer Dashboard</h2>
          <p className="text-sm">Manage your profile and orders</p>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Profile Details */}
          <div className="bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
            <form>
              <div className="mb-4">
                <label htmlFor="firstName" className="block text-gray-400 text-sm font-bold mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="lastName" className="block text-gray-400 text-sm font-bold mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-400 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="mobilePhone" className="block text-gray-400 text-sm font-bold mb-2">
                  Mobile Phone
                </label>
                <input
                  type="text"
                  id="mobilePhone"
                  name="mobilePhone"
                  value={profileData.mobilePhone}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block text-gray-400 text-sm font-bold mb-2">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={`${profileData.address}, ${profileData.city}, ${profileData.country}`}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
                />
              </div>
            </form>
          </div>

          {/* Order History */}
          <div className="bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">Order History</h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-gray-400 font-semibold py-2">Order ID</th>
                  <th className="text-left text-gray-400 font-semibold py-2">Date</th>
                  <th className="text-left text-gray-400 font-semibold py-2">Total</th>
                  <th className="text-left text-gray-400 font-semibold py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {orderHistory.length > 0 ? (
                  orderHistory.map((order) => (
                    <tr key={order.orderId} className="border-b border-gray-700">
                      <td className="py-2">{order.orderId}</td>
                      <td className="py-2">{order.date}</td>
                      <td className="py-2">{order.total}</td>
                      <td className="py-2">{order.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="bg-gray-800 rounded-lg shadow p-4 mt-4">
          <h3 className="text-lg font-semibold mb-4">Recommended Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gray-700 p-4 rounded-lg shadow">
                <img
                  src="/product-placeholder.png" // Replace with your product image
                  alt={`Product ${item}`}
                  className="w-full h-32 object-cover mb-2"
                />
                <h4 className="text-lg font-semibold text-white">Product {item}</h4>
                <p className="text-gray-400">$20.00</p>
                <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="bg-gray-800 rounded-lg shadow p-4 mt-4">
          <h3 className="text-lg font-semibold mb-4">Stock Alerts</h3>
          <ul>
            <li className="mb-2">
              <span className="text-red-500 font-semibold">Out of Stock:</span> Laptop X1
            </li>
            <li className="mb-2">
              <span className="text-yellow-500 font-semibold">Low Stock:</span> Headphones Y2
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CDashboard;