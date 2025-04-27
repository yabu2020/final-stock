import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons

function Resetpassword() {
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    const complexityRe = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!complexityRe.test(password)) {
      return "Password must contain at least one letter and one number";
    }
    return null;
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();

    setNameError("");
    setPasswordError("");
    setResetMessage("");

    if (!name) {
      setNameError("Name is required");
      return;
    }
    if (!newPassword) {
      setPasswordError("New password is required");
      return;
    }
    const passwordValidationError = validatePassword(newPassword);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    axios
      .post("http://localhost:3001/resetpassword", {
        name, // Sending name instead of email
        newPassword,
      })
      .then((response) => {
        setResetMessage(response.data.message);
        setName("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((err) => {
        console.error(err.response ? err.response.data : err.message);
        setResetMessage("An error occurred while resetting the password.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      {/* Form Container */}
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-gray-800 border border-gray-700">
        <form onSubmit={handlePasswordReset} className="space-y-6">
          {/* Heading */}
          <h2 className="text-2xl font-bold text-blue-400 text-center">Reset Password</h2>

          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-gray-300 font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-2 bg-gray-700 border ${
                nameError ? "border-red-500" : "border-gray-600"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white`}
            />
            {nameError && <p className="text-red-500 mt-2">{nameError}</p>}
          </div>

          {/* New Password Input */}
          <div className="relative">
            <label htmlFor="newPassword" className="block text-gray-300 font-medium mb-2">
              New Password
            </label>
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full px-4 py-2 bg-gray-700 border ${
                passwordError ? "border-red-500" : "border-gray-600"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white pr-10`} // Added pr-10 for padding on the right
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute top-[50%] transform -translate-y-1/2 right-3 flex items-center text-gray-400 hover:text-gray-300 cursor-pointer z-10"
              title={showNewPassword ? "Hide Password" : "Show Password"}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-gray-300 font-medium mb-2">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-2 bg-gray-700 border ${
                passwordError ? "border-red-500" : "border-gray-600"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white pr-10`} // Added pr-10 for padding on the right
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-[50%] transform -translate-y-1/2 right-3 flex items-center text-gray-400 hover:text-gray-300 cursor-pointer z-10"
              title={showConfirmPassword ? "Hide Password" : "Show Password"}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            Reset Password
          </button>

          {/* Success/Error Messages */}
          {passwordError && <p className="text-red-500 text-sm text-center">{passwordError}</p>}
          {resetMessage && <p className="text-green-500 text-sm text-center">{resetMessage}</p>}
        </form>
      </div>
    </div>
  );
}

export default Resetpassword;