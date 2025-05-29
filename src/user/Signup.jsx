import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Signup() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState(""); // General form error state
  const [showPassword, setShowPassword] = useState(false); // Password visibility state

  const navigate = useNavigate(); // Initialize useNavigate

  // Validate phone number format
  const validatePhone = (phone) => {
    const re = /^(09|07)\d{8}$/;
    return re.test(phone);
  };

  // Validate password strength
  const validatePassword = (password) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return re.test(password);
  };

  const validateName = (name) => /^[A-Za-z\s]+$/.test(name);

  // Validate address: not numbers only
  const validateAddress = (address) => /[A-Za-z]/.test(address); // Must contain at least one letter
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Clear previous errors
    setNameError("");
    setPhoneError("");
    setAddressError("");
    setPasswordError("");
    setFormError("");
  
    // Name validation
    if (!name) {
      setNameError("Name is required");
      return;
    }
    if (!validateName(name)) {
      setNameError("Name must contain letters only");
      return;
    }
  
    // Phone validation
    if (!phone) {
      setPhoneError("Phone number is required");
      return;
    }
    if (!validatePhone(phone)) {
      setPhoneError("Phone number must start with 09 or 07 and be 10 digits long");
      return;
    }
  
    // Address validation
    if (!address) {
      setAddressError("Address is required");
      return;
    }
    if (!validateAddress(address)) {
      setAddressError("Address must contain letters (cannot be numbers only)");
      return;
    }
  
    // Password validation
    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters long and include letters and numbers");
      return;
    }
  
    axios
  .post("http://localhost:3001/signup", {
    name,
    phone,
    password,
    address,
    type: "user" // 👈 Add this line
  })
  .then((result) => {
    // Show success message
    setFormError("Successfully registered! Redirecting to login...");
    
    // Delay navigation using setTimeout
    setTimeout(() => {
      navigate("/login");
    }, 2000); // 2000 milliseconds = 2 seconds
  })
  .catch((err) => {
    if (err.response && err.response.data && err.response.data.error) {
      setFormError(err.response.data.error);
    } else {
      console.log(err);
      setFormError("Error registering user");
    }
  });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 dark:bg-gray-900">
      <div className="w-full p-8 rounded-lg shadow-lg" style={{ maxWidth: '500px', backgroundColor: '#1f2937' }}>
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-400 dark:text-blue-400">
          Sign Up
        </h2>
        {formError && <p className="text-red-500 mb-4 text-center">{formError}</p>}
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-4">
            <label className="block font-bold mb-2 text-gray-300 dark:text-gray-300" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 rounded border ${nameError ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-blue-400 bg-gray-700 text-white dark:bg-gray-700 dark:text-white`}
            />
            {nameError && <p className="text-red-500 mt-2">{nameError}</p>}
          </div>

          {/* Phone Field */}
          <div className="mb-4">
            <label className="block font-bold mb-2 text-gray-300 dark:text-gray-300" htmlFor="phone">
              Phone
            </label>
            <input
              type="text"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full px-3 py-2 rounded border ${phoneError ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-blue-400 bg-gray-700 text-white dark:bg-gray-700 dark:text-white`}
            />
            {phoneError && <p className="text-red-500 mt-2">{phoneError}</p>}
          </div>

          {/* Address Field */}
          <div className="mb-4">
            <label className="block font-bold mb-2 text-gray-300 dark:text-gray-300" htmlFor="address">
              Address
            </label>
            <input
              type="text"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`w-full px-3 py-2 rounded border ${addressError ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-blue-400 bg-gray-700 text-white dark:bg-gray-700 dark:text-white`}
            />
            {addressError && <p className="text-red-500 mt-2">{addressError}</p>}
          </div>

          {/* Password Field */}
          <div className="mb-4 relative">
            <label className="block font-bold mb-2 text-gray-300 dark:text-gray-300" htmlFor="password">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 rounded border ${passwordError ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-blue-400 bg-gray-700 text-white dark:bg-gray-700 dark:text-white`}
            />
            <div
              className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Hide Password' : 'Show Password'}
            >
              {showPassword ? (
                <FaEyeSlash className="text-gray-400 dark:text-gray-400" />
              ) : (
                <FaEye className="text-gray-400 dark:text-gray-400" />
              )}
            </div>
            {passwordError && <p className="text-red-500 mt-2">{passwordError}</p>}
          </div>

          {/* Submit Button */}
          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Sign Up
            </button>
          </div>
        </form>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-gray-400 dark:text-gray-400">
            Already have an account?{" "}
            <span
              className="text-blue-400 cursor-pointer hover:underline dark:text-blue-400"
              onClick={() => navigate("/login")} // Navigate to the login page
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;