import React, { useState } from "react";
import axios from "axios";

function CreateUser() {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation helper functions (same as your original code)
  const validateName = (name) => {
    if (!name.trim()) return "Name is required";
    if (/^\d+$/.test(name.trim())) return "Name cannot be only numbers";
    return "";
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return "Phone is required";
    if (!/^(09|07)\d{8}$/.test(phone.trim()))
      return "Phone must be 10 digits and start with 09 or 07";
    return "";
  };

  const validateAddress = (address) => {
    if (!address.trim()) return "Address is required";
    if (!/[A-Za-z]/.test(address)) return "Address must contain letters";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters long";
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password))
      return "Password must contain both letters and numbers";
    return "";
  };

  const validateAll = () => ({
    customerName: validateName(customerName),
    customerPhone: validatePhone(customerPhone),
    customerAddress: validateAddress(customerAddress),
    password: validatePassword(password),
  });

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field),
    }));
  };

  const validateField = (field) => {
    switch (field) {
      case "customerName":
        return validateName(customerName);
      case "customerPhone":
        return validatePhone(customerPhone);
      case "customerAddress":
        return validateAddress(customerAddress);
      case "password":
        return validatePassword(password);
      default:
        return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const validationErrors = validateAll();
    setErrors(validationErrors);
    setTouched({
      customerName: true,
      customerPhone: true,
      customerAddress: true,
      password: true,
    });

    const hasErrors = Object.values(validationErrors).some((msg) => msg);
    if (hasErrors) {
      setFormError("Please fix the errors before submitting.");
      return;
    }

    try {
      const payload = {
        type: "user",
        name: customerName.trim(),
        phone: customerPhone.trim(),
        password,
        address: customerAddress.trim(),
      };

      await axios.post("http://localhost:3001/adduser", payload);
      alert("Customer account created successfully!");

      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
      setPassword("");
      setFormError("");
      setErrors({});
      setTouched({});
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Error creating user";
      setFormError(errorMessage);
    }
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-6">Create Customer Account</h2>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer Name */}
          <div>
            <label className="block mb-1">Customer Name</label>
            <input
              type="text"
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              onBlur={() => handleBlur("customerName")}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            />
            {touched.customerName && errors.customerName && (
              <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
            )}
          </div>

          {/* Customer Phone */}
          <div>
            <label className="block mb-1">Customer Phone</label>
            <input
              type="text"
              placeholder="Enter customer phone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              onBlur={() => handleBlur("customerPhone")}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            />
            {touched.customerPhone && errors.customerPhone && (
              <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>
            )}
          </div>

          {/* Customer Address */}
          <div>
            <label className="block mb-1">Customer Address</label>
            <input
              type="text"
              placeholder="Enter customer address"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              onBlur={() => handleBlur("customerAddress")}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            />
            {touched.customerAddress && errors.customerAddress && (
              <p className="text-red-500 text-sm mt-1">{errors.customerAddress}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur("password")}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            />
            {touched.password && errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400"
        >
          Create Customer Account
        </button>

        {/* Error Message */}
        {formError && (
          <p className="text-red-500 mt-4">{formError}</p>
        )}
      </form>
    </div>
  );
}

export default CreateUser;
