import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons

function ResetPassword() {
  const { userId } = useParams();
  const [name, setName] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false); // State for new password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Updated regular expression for password validation
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

  const predefinedQuestions = [
    "Date of Birth",
    "Favorite Food",
    "Mother’s Maiden Name",
    "First Pet’s Name",
    "High School Name",
    "City of Birth",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Check if all fields are filled
    if (!name || !securityQuestion || !securityAnswer || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Validate new password
    if (!passwordRegex.test(newPassword)) {
      setError("Password must be at least 6 characters long and include both letters and numbers.");
      return;
    }

    // Proceed with password reset request
    axios
      .post("http://localhost:3001/reset-password", { name, securityQuestion, securityAnswer, newPassword })
      .then((response) => {
        if (response.data.success) {
          setMessage("Password has been reset successfully. You will be redirected to the login page.");
          setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3 seconds
        } else {
          setError(response.data.message || "Error resetting password. Please try again.");
        }
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
        setError(errorMessage);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      {/* Form Container */}
      <div className="max-w-md w-full p-6 bg-gray-800 shadow-lg rounded-lg border border-gray-700">
        <h1 className="text-2xl font-bold text-blue-400 mb-6 text-center">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-md font-semibold text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm text-white"
            />
          </div>

          {name && (
            <>
              {/* Security Question Dropdown */}
              <div>
                <label htmlFor="securityQuestion" className="block text-md font-semibold mt-4 text-gray-300">
                  Security Question
                </label>
                <select
                  id="securityQuestion"
                  value={securityQuestion}
                  onChange={(e) => setSecurityQuestion(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm text-white"
                >
                  <option value="" disabled>
                    Select a security question
                  </option>
                  {predefinedQuestions.map((question, index) => (
                    <option key={index} value={question}>
                      {question}
                    </option>
                  ))}
                </select>
              </div>

              {/* Security Answer Input */}
              <div>
                <label htmlFor="securityAnswer" className="block text-md font-semibold mt-4 text-gray-300">
                  Answer Security Question
                </label>
                <input
                  type="text"
                  id="securityAnswer"
                  placeholder="Enter your answer"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm text-white"
                />
              </div>

              {/* New Password Input */}
              <div>
                <label htmlFor="newPassword" className="block text-md font-semibold mt-4 text-gray-300">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm text-white"
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    title={showNewPassword ? "Hide Password" : "Show Password"}
                  >
                    {showNewPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                  </div>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-md font-semibold mt-4 text-gray-300">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm text-white"
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    title={showConfirmPassword ? "Hide Password" : "Show Password"}
                  >
                    {showConfirmPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md mt-4 shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            Reset Password
          </button>

          {/* Success/Error Messages */}
          {message && <p className="text-green-500 font-semibold text-center">{message}</p>}
          {error && <p className="text-red-500 font-semibold text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;