import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreateUser() {
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    customerName: false,
    customerPhone: false,
    customerAddress: false,
    password: false,
  });

  const [errors, setErrors] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field validation rules
  const validateField = (name, value) => {
    switch (name) {
      case "customerName":
        if (!value.trim()) return "Name is required";
        if (value.length < 3) return "Name must be at least 3 characters";
        if (/^\d+$/.test(value)) return "Name cannot be only numbers";
        return "";

      case "customerPhone":
        if (!value.trim()) return "Phone number is required";
        if (!/^(09|07)\d{8}$/.test(value)) 
          return "Must start with 09 or 07 and be 10 digits";
        return "";

      case "customerAddress":
        if (!value.trim()) return "Address is required";
        if (/^\d+$/.test(value)) return "Address must include letters";
        if (value.length < 5) return "Address must be at least 5 characters";
        return "";

      case "password":
        if (!value.trim()) return "Password is required";
        if (value.length < 6) return "Must be at least 6 characters";
        if (!/[a-zA-Z]/.test(value) || !/\d/.test(value)) 
          return "Must include letters and numbers";
        return "";

      default:
        return "";
    }
  };

  // Handle field blur (mark as touched and validate)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  // Handle input changes with real-time validation for touched fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate in real-time only after field is touched
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  // Validate entire form before submission
  const validateForm = () => {
    const newErrors = {
      customerName: validateField("customerName", formData.customerName),
      customerPhone: validateField("customerPhone", formData.customerPhone),
      customerAddress: validateField("customerAddress", formData.customerAddress),
      password: validateField("password", formData.password),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mark all fields as touched to show errors
    setTouched({
      customerName: true,
      customerPhone: true,
      customerAddress: true,
      password: true,
    });

    // Validate form before submission
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        type: "user",
        name: formData.customerName,
        phone: formData.customerPhone,
        address: formData.customerAddress,
        password: formData.password,
      };

      await axios.post("http://localhost:3001/adduser", payload);

      // Show success toast
      toast.success("Customer account created successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Reset form
      setFormData({ 
        customerName: "", 
        customerPhone: "", 
        customerAddress: "", 
        password: "" 
      });
      setTouched({ 
        customerName: false, 
        customerPhone: false, 
        customerAddress: false, 
        password: false 
      });
      setErrors({ 
        customerName: "", 
        customerPhone: "", 
        customerAddress: "", 
        password: "" 
      });

    } catch (err) {
      const errorMsg = err.response?.data?.error || "Error creating user account";
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">
          Create Customer Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 ${
                errors.customerName 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-gray-600 focus:ring-blue-500"
              } border`}
              placeholder="John Doe"
              disabled={isSubmitting}
            />
            {errors.customerName && (
              <p className="mt-1 text-sm text-red-400">{errors.customerName}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Phone Number
            </label>
            <input
              type="text"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 ${
                errors.customerPhone 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-gray-600 focus:ring-blue-500"
              } border`}
              placeholder="0912345678"
              disabled={isSubmitting}
            />
            {errors.customerPhone && (
              <p className="mt-1 text-sm text-red-400">{errors.customerPhone}</p>
            )}
          </div>

          {/* Address Field */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Address
            </label>
            <input
              type="text"
              name="customerAddress"
              value={formData.customerAddress}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 ${
                errors.customerAddress 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-gray-600 focus:ring-blue-500"
              } border`}
              placeholder="123 Main St, City"
              disabled={isSubmitting}
            />
            {errors.customerAddress && (
              <p className="mt-1 text-sm text-red-400">{errors.customerAddress}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 ${
                  errors.password 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-gray-600 focus:ring-blue-500"
                } border`}
                placeholder="At least 6 characters"
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ${
              isSubmitting
                ? "bg-blue-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            {isSubmitting ? "Creating Account..." : "Create Customer Account"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default CreateUser;