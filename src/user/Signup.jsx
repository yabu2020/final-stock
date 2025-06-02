import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    password: ""
  });
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    address: "",
    password: "",
    form: ""
  });
  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    address: false,
    password: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value.trim()) error = "Name is required";
        else if (!/^[A-Za-z\s]+$/.test(value)) error = "Name must contain letters only";
        else if (value.length < 2) error = "Name must be at least 2 characters";
        break;
      case "phone":
        if (!value.trim()) error = "Phone number is required";
        else if (!/^(09|07)\d{8}$/.test(value)) error = "Must start with 09 or 07 and be 10 digits";
        break;
      case "address":
        if (!value.trim()) error = "Address is required";
        else if (!/[A-Za-z]/.test(value)) error = "Must contain letters (not numbers only)";
        else if (value.length < 5) error = "Address must be at least 5 characters";
        break;
      case "password":
        if (!value.trim()) error = "Password is required";
        else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value)) error = "Must be 6+ chars with letters and numbers";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateForm = () => {
    const newErrors = {
      name: validateField("name", formData.name),
      phone: validateField("phone", formData.phone),
      address: validateField("address", formData.address),
      password: validateField("password", formData.password),
      form: ""
    };
    setErrors(newErrors);
    return !newErrors.name && !newErrors.phone && !newErrors.address && !newErrors.password;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTouched({ name: true, phone: true, address: true, password: true });
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    axios.post("http://localhost:3001/signup", { ...formData, type: "user" })
      .then(() => {
        setErrors(prev => ({ ...prev, form: "Registration successful! Redirecting to login..." }));
        setTimeout(() => navigate("/login"), 2000);
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.error || "Registration failed. Please try again.";
        setErrors(prev => ({ ...prev, form: errorMsg }));
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-lg shadow-lg bg-gray-800 text-white">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-blue-400">
          Sign Up
        </h2>

        {errors.form && (
          <div className={`mb-4 p-3 rounded text-center ${
            errors.form.includes("success") 
              ? "bg-green-900/50 text-green-200" 
              : "bg-red-900/50 text-red-200"
          }`}>
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block font-medium mb-1 text-gray-300" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 rounded border ${
                errors.name ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="block font-medium mb-1 text-gray-300" htmlFor="phone">
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 rounded border ${
                errors.phone ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white`}
              placeholder="0912345678"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
            )}
          </div>

          {/* Address Field */}
          <div>
            <label className="block font-medium mb-1 text-gray-300" htmlFor="address">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 rounded border ${
                errors.address ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white`}
              placeholder="123 Main St, City"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-400">{errors.address}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="relative">
            <label className="block font-medium mb-1 text-gray-300" htmlFor="password">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 rounded border ${
                errors.password ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white`}
              placeholder="At least 6 characters"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 mt-6 rounded-md font-semibold ${
              isSubmitting
                ? "bg-blue-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500"
            } text-white transition`}
          >
            {isSubmitting ? "Registering..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-400 hover:underline focus:outline-none"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;