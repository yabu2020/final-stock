import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Resetpassword() {
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    newPassword: false,
    confirmPassword: false,
  });

  const validateName = (name) => {
    if (!name.trim()) return "Name is required";
    const nameRe = /^[A-Za-z]+$/;
    if (!nameRe.test(name)) return "Name must contain only letters";
    if (name.length < 3) return "Name must be at least 3 characters long";
    return "";
  };
  

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    const complexityRe = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!complexityRe.test(password))
      return "Password must contain at least one letter and one number";
    return "";
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== newPassword) return "Passwords do not match";
    return "";
  };

  useEffect(() => {
    setNameError(validateName(name));
    setPasswordError(validatePassword(newPassword));
    setConfirmPasswordError(validateConfirmPassword(confirmPassword));
  }, [name, newPassword, confirmPassword]);

  const handlePasswordReset = (e) => {
    e.preventDefault();

    const nameErr = validateName(name);
    const passErr = validatePassword(newPassword);
    const confirmErr = validateConfirmPassword(confirmPassword);

    setNameError(nameErr);
    setPasswordError(passErr);
    setConfirmPasswordError(confirmErr);

    if (nameErr || passErr || confirmErr) return;

    axios.post("http://localhost:3001/resetpassword", { name, newPassword })
    .then((response) => {
      setResetMessage(response.data.message); // e.g., "Password reset successful"
      // reset fields ...
    })
    .catch((error) => {
      if (error.response) {
        // Backend responded with a status code out of 2xx range
        if (error.response.status === 404) {
          setResetMessage("No user with that name found."); // show backend 404 error
        } else if (error.response.data && error.response.data.message) {
          setResetMessage(error.response.data.message); // other backend validation errors
        } else {
          setResetMessage("An error occurred while resetting the password.");
        }
      } else {
        // Network error or no response
        setResetMessage("Network error. Please try again later.");
      }
    });
  
  };

  const allTouched = touched.name && touched.newPassword && touched.confirmPassword;
  const hasErrors = nameError || passwordError || confirmPasswordError;
  const disableSubmit = hasErrors || !allTouched;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-gray-800 border border-gray-700">
        <form onSubmit={handlePasswordReset} className="space-y-6">
          <h2 className="text-2xl font-bold text-blue-400 text-center">Reset Password</h2>

          {/* Name Field */}
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
              onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
              className={`w-full px-4 py-2 bg-gray-700 border ${
                nameError && touched.name ? "border-red-500" : "border-gray-600"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white`}
            />
            {nameError && touched.name && (
              <p className="text-red-500 mt-1 text-sm">{nameError}</p>
            )}
          </div>

         {/* New Password Field */}
<div className="relative">
  <label htmlFor="newPassword" className="block text-gray-300 font-medium mb-2">
    New Password
  </label>
  <div className="relative">
    <input
      type={showNewPassword ? "text" : "password"}
      id="newPassword"
      placeholder="Enter new password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      onBlur={() => setTouched((prev) => ({ ...prev, newPassword: true }))}
      className={`w-full px-4 py-2 bg-gray-700 border ${
        passwordError && touched.newPassword ? "border-red-500" : "border-gray-600"
      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white`}
    />
    <button
      type="button"
      onClick={() => setShowNewPassword(!showNewPassword)}
      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300"
      title={showNewPassword ? "Hide Password" : "Show Password"}
    >
      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
    </button>
  </div>
  {passwordError && touched.newPassword && (
    <p className="text-red-500 mt-1 text-sm">{passwordError}</p>
  )}
</div>

{/* Confirm Password Field */}
<div className="relative">
  <label htmlFor="confirmPassword" className="block text-gray-300 font-medium mb-2">
    Confirm Password
  </label>
  <div className="relative">
    <input
      type={showConfirmPassword ? "text" : "password"}
      id="confirmPassword"
      placeholder="Confirm password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
      className={`w-full px-4 py-2 bg-gray-700 border ${
        confirmPasswordError && touched.confirmPassword ? "border-red-500" : "border-gray-600"
      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white`}
    />
    <button
      type="button"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300"
      title={showConfirmPassword ? "Hide Password" : "Show Password"}
    >
      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
    </button>
  </div>
  {confirmPasswordError && touched.confirmPassword && (
    <p className="text-red-500 mt-1 text-sm">{confirmPasswordError}</p>
  )}
</div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={disableSubmit}
            className={`w-full ${
              disableSubmit ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
            } text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
          >
            Reset Password
          </button>

          {/* Response Message */}
          {resetMessage && <p className="text-green-500 text-sm text-center">{resetMessage}</p>}
        </form>
      </div>
    </div>
  );
}

export default Resetpassword;
