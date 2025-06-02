import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function ResetPassword() {
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
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

    setTouched({
      name: true,
      newPassword: true,
      confirmPassword: true
    });

    if (nameError || passwordError || confirmPasswordError) return;

    axios.post("http://localhost:3001/resetpassword", { name, newPassword })
      .then((response) => {
        toast.success(response.data.message);
        setName("");
        setNewPassword("");
        setConfirmPassword("");
        setTouched({
          name: false,
          newPassword: false,
          confirmPassword: false
        });
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          toast.error("No user with that name found");
        } else {
          toast.error(error.response?.data?.message || "Error resetting password");
        }
      });
  };

  const allTouched = touched.name && touched.newPassword && touched.confirmPassword;
  const hasErrors = nameError || passwordError || confirmPasswordError;
  const disableSubmit = hasErrors || !allTouched;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-lg shadow-lg bg-gray-800 border border-gray-700">
        <form onSubmit={handlePasswordReset} className="space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-400 text-center">Reset Password</h2>

          <div>
            <label htmlFor="name" className="block text-gray-300 font-medium mb-1 sm:mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
              className={`w-full px-3 sm:px-4 py-2 bg-gray-700 border ${
                nameError && touched.name ? "border-red-500" : "border-gray-600"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white`}
            />
            {nameError && touched.name && (
              <p className="text-red-500 mt-1 text-xs sm:text-sm">{nameError}</p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="newPassword" className="block text-gray-300 font-medium mb-1 sm:mb-2">
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
                className={`w-full px-3 sm:px-4 py-2 bg-gray-700 border ${
                  passwordError && touched.newPassword ? "border-red-500" : "border-gray-600"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300"
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {passwordError && touched.newPassword && (
              <p className="text-red-500 mt-1 text-xs sm:text-sm">{passwordError}</p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-gray-300 font-medium mb-1 sm:mb-2">
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
                className={`w-full px-3 sm:px-4 py-2 bg-gray-700 border ${
                  confirmPasswordError && touched.confirmPassword ? "border-red-500" : "border-gray-600"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {confirmPasswordError && touched.confirmPassword && (
              <p className="text-red-500 mt-1 text-xs sm:text-sm">{confirmPasswordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={disableSubmit}
            className={`w-full ${
              disableSubmit ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
            } text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
          >
            Reset Password
          </button>
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

export default ResetPassword;