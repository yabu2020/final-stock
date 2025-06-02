import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreateUser() {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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
      toast.success("Customer account created successfully!");

      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
      setPassword("");
      setFormError("");
      setErrors({});
      setTouched({});
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Error creating user";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-900 min-h-screen text-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">Create Customer Account</h2>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm sm:text-base">Customer Name</label>
              <input
                type="text"
                placeholder="Enter customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                onBlur={() => handleBlur("customerName")}
                className={`w-full px-3 py-2 rounded bg-gray-700 text-white border ${
                  errors.customerName && touched.customerName ? "border-red-500" : "border-gray-600"
                }`}
              />
              {touched.customerName && errors.customerName && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.customerName}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm sm:text-base">Customer Phone</label>
              <input
                type="text"
                placeholder="Enter customer phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                onBlur={() => handleBlur("customerPhone")}
                className={`w-full px-3 py-2 rounded bg-gray-700 text-white border ${
                  errors.customerPhone && touched.customerPhone ? "border-red-500" : "border-gray-600"
                }`}
              />
              {touched.customerPhone && errors.customerPhone && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.customerPhone}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm sm:text-base">Customer Address</label>
              <input
                type="text"
                placeholder="Enter customer address"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                onBlur={() => handleBlur("customerAddress")}
                className={`w-full px-3 py-2 rounded bg-gray-700 text-white border ${
                  errors.customerAddress && touched.customerAddress ? "border-red-500" : "border-gray-600"
                }`}
              />
              {touched.customerAddress && errors.customerAddress && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.customerAddress}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm sm:text-base">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur("password")}
                className={`w-full px-3 py-2 rounded bg-gray-700 text-white border ${
                  errors.password && touched.password ? "border-red-500" : "border-gray-600"
                }`}
              />
              {touched.password && errors.password && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition w-full sm:w-auto"
          >
            Create Customer Account
          </button>

          {formError && (
            <p className="text-red-500 mt-4 text-sm sm:text-base">{formError}</p>
          )}
        </form>
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default CreateUser;