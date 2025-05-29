import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Help() {
  const { userId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", email: "", description: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
      valid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!validateForm()) return;

    const payload = { ...formData, userId };

    axios
      .post("http://localhost:3001/contact", payload)
      .then((response) => {
        setMessage(response.data.message || "Your message has been sent successfully!");
        setFormData({ name: "", email: "", description: "" });
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || err.message || "Failed to send message";
        setError(errorMsg);
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-blue-400 mb-6">Contact Us</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-gray-300 mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full p-3 bg-gray-800 border ${
              formErrors.name ? "border-red-500" : "border-gray-600"
            } rounded-md text-white`}
            placeholder="Your Name"
          />
          {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-300 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full p-3 bg-gray-800 border ${
              formErrors.email ? "border-red-500" : "border-gray-600"
            } rounded-md text-white`}
            placeholder="you@example.com"
          />
          {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-300 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="5"
            className={`w-full p-3 bg-gray-800 border ${
              formErrors.description ? "border-red-500" : "border-gray-600"
            } rounded-md text-white`}
            placeholder="Describe your issue or inquiry here..."
          />
          {formErrors.description && (
            <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="py-3 px-6 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500"
          >
            Send Message
          </button>
        </div>

        {message && <div className="p-3 bg-green-100 text-green-800 rounded-md">{message}</div>}
        {error && <div className="p-3 bg-red-100 text-red-800 rounded-md">{error}</div>}
      </form>
    </div>
  );
}

export default Help;
