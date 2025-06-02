import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ResetPassword() {
  const { userId } = useParams();
  const [name, setName] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({
    name: "",
    securityQuestion: "",
    securityAnswer: "",
    newPassword: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const predefinedQuestions = [
    "Date of Birth",
    "Favorite Food",
    "Mother’s Maiden Name",
    "First Pet’s Name",
    "High School Name",
    "City of Birth",
  ];

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      errors.name = "Name should contain only letters and spaces";
      isValid = false;
    }

    if (!securityQuestion) {
      errors.securityQuestion = "Security question is required";
      isValid = false;
    }

    if (!securityAnswer.trim()) {
      errors.securityAnswer = "Security answer is required";
      isValid = false;
    }

    if (!newPassword) {
      errors.newPassword = "Password is required";
      isValid = false;
    } else if (newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters long";
      isValid = false;
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(newPassword)) {
      errors.newPassword = "Password must contain both letters and numbers";
      isValid = false;
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (confirmPassword !== newPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (!validateForm()) return;

    axios
      .post("http://localhost:3001/reset-password", {
        name,
        securityQuestion,
        securityAnswer,
        newPassword,
      })
      .then((response) => {
        if (response.data.success) {
          setMessage(
            "Password has been reset successfully. You will be redirected to the login page."
          );
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setError(
            response.data.message ||
              "Error resetting password. Please try again."
          );
        }
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message ||
          "An error occurred. Please try again.";
        setError(errorMessage);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormErrors((prev) => ({ ...prev, [name]: "" }));

    switch (name) {
      case "name":
        setName(value);
        break;
      case "securityQuestion":
        setSecurityQuestion(value);
        break;
      case "securityAnswer":
        setSecurityAnswer(value);
        break;
      case "newPassword":
        setNewPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full p-6 bg-gray-800 shadow-lg rounded-lg border border-gray-700">
        <h1 className="text-2xl font-bold text-blue-400 mb-6 text-center">
          Reset Password
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-md font-semibold text-gray-300"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={name}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-3 py-2 bg-gray-700 border ${
                formErrors.name ? "border-red-500" : "border-gray-600"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm text-white`}
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
            )}
          </div>
          {name && (
            <>
              <div>
                <label
                  htmlFor="securityQuestion"
                  className="block text-md font-semibold text-gray-300"
                >
                  Security Question
                </label>
                <select
                  id="securityQuestion"
                  name="securityQuestion"
                  value={securityQuestion}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 bg-gray-700 border ${
                    formErrors.securityQuestion
                      ? "border-red-500"
                      : "border-gray-600"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm text-white`}
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
                {formErrors.securityQuestion && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.securityQuestion}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="securityAnswer"
                  className="block text-md font-semibold text-gray-300"
                >
                  Answer Security Question
                </label>
                <input
                  type="text"
                  id="securityAnswer"
                  name="securityAnswer"
                  placeholder="Enter your answer"
                  value={securityAnswer}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 bg-gray-700 border ${
                    formErrors.securityAnswer
                      ? "border-red-500"
                      : "border-gray-600"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm text-white`}
                />
                {formErrors.securityAnswer && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.securityAnswer}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-md font-semibold text-gray-300"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 bg-gray-700 border ${
                      formErrors.newPassword
                        ? "border-red-500"
                        : "border-gray-600"
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm text-white`}
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    title={showNewPassword ? "Hide Password" : "Show Password"}
                  >
                    {showNewPassword ? (
                      <FaEyeSlash className="text-gray-400" />
                    ) : (
                      <FaEye className="text-gray-400" />
                    )}
                  </div>
                </div>
                {formErrors.newPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.newPassword}
                  </p>
                )}
                {newPassword && (
                  <p
                    className={`mt-1 text-xs ${
                      newPassword.length < 6 ||
                      !/(?=.*[a-zA-Z])(?=.*\d)/.test(newPassword)
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {newPassword.length < 6 ||
                    !/(?=.*[a-zA-Z])(?=.*\d)/.test(newPassword)
                      ? "Password must be at least 6 characters and contain both letters and numbers"
                      : " "}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-md font-semibold text-gray-300"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 bg-gray-700 border ${
                      formErrors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-600"
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm text-white`}
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    title={
                      showConfirmPassword ? "Hide Password" : "Show Password"
                    }
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="text-gray-400" />
                    ) : (
                      <FaEye className="text-gray-400" />
                    )}
                  </div>
                </div>
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md mt-4 shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            Reset Password
          </button>
          {message && (
            <p className="text-green-500 font-semibold text-center">
              {message}
            </p>
          )}
          {error && (
            <p className="text-red-500 font-semibold text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
