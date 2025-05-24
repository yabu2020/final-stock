// CreateUser.js
import React, { useState } from "react";
import axios from "axios";
import io from "socket.io-client";


function CreateUser() {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!customerName || !customerPhone || !customerAddress || !password) {
      setFormError("All fields are required");
      return;
    }

    try {
      const payload = {
        type: "user", // Customer type
        name: customerName,
        phone: customerPhone,
        password,
        address: customerAddress,
      };

      console.log("Payload being sent:", payload); // Debugging

      await axios.post("http://localhost:3001/adduser", payload);
      alert("Customer account created successfully!");
      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
      setPassword("");

    } catch (err) {
      const errorMessage = err.response?.data?.error || "Error creating user";
      console.error(errorMessage);
      setFormError(errorMessage);
    }
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Customer Account</h2>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        {/* Customer Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Customer Name</label>
          <input
            type="text"
            placeholder="Enter customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Customer Phone */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Customer Phone</label>
          <input
            type="text"
            placeholder="Enter customer phone"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Customer Address */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Customer Address</label>
          <input
            type="text"
            placeholder="Enter customer address"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Customer Account
        </button>

        {/* Error Message */}
        {formError && <p className="text-red-500 mt-4 text-center">{formError}</p>}
      </form>
    </div>
  );
}

export default CreateUser;