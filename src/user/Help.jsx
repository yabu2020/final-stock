import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import emailjs from "@emailjs/browser";

function Help() {
  const { userId } = useParams();
  const formRef = useRef();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
    setMessage("");
    setError("");
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      errors.name = "Name should contain only letters and spaces.";
    }
    if (!formData.email) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Enter a valid email address.";
    }
    if (!formData.description.trim()) {
      errors.description = "Description is required.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    emailjs
      .sendForm("service_wwi5cng", "template_w3an7ta", formRef.current, {
        publicKey: "zA4kezC0h1AJ81NYZ",
      })
      .then(
        () => {
          setFormData({ name: "", email: "", description: "" });
          setMessage("Message sent successfully!");
        },
        (err) => {
          console.error("EmailJS Error:", err.text);
          setError("Failed to send message. Please try again.");
        }
      );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-blue-400 mb-6 text-center">Contact Us</h2>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg text-gray-300 mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className={`w-full p-3 bg-gray-800 border ${
              formErrors.name ? "border-red-500" : "border-gray-600"
            } rounded-md text-white`}
          />
          {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
        </div>

        <div>
          <label className="block text-lg text-gray-300 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={`w-full p-3 bg-gray-800 border ${
              formErrors.email ? "border-red-500" : "border-gray-600"
            } rounded-md text-white`}
          />
          {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
        </div>

        <div>
          <label className="block text-lg text-gray-300 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            placeholder="Describe your issue or inquiry here..."
            className={`w-full p-3 bg-gray-800 border ${
              formErrors.description ? "border-red-500" : "border-gray-600"
            } rounded-md text-white`}
          />
          {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="py-3 px-6 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 transition duration-300"
          >
            Send Message
          </button>
        </div>

        {message && <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">{message}</div>}
        {error && <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">{error}</div>}
      </form>
    </div>
  );
}

export default Help;