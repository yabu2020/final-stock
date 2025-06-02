import React, { useState, useEffect } from "react";
import axios from "axios";

function Category() {
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({
    category: "",
    code: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateCategory = (value) => {
    if (!value.trim()) return "Category name is required";
    if (/^\d+$/.test(value)) return "Category cannot be only numbers";
    if (!/^[A-Za-z0-9\s]+$/.test(value)) return "Only letters, numbers and spaces allowed";
    return "";
  };

  const validateCode = (value) => {
    if (!value.trim()) return "Code is required";
    if (!/^[A-Za-z0-9]+$/.test(value)) return "Only letters and numbers allowed (no spaces)";
    return "";
  };

  const handleBlur = (field) => {
    if (field === "category") {
      setErrors((prev) => ({ ...prev, category: validateCategory(category) }));
    } else if (field === "code") {
      setErrors((prev) => ({ ...prev, code: validateCode(code) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const categoryError = validateCategory(category);
    const codeError = validateCode(code);

    setErrors({
      category: categoryError,
      code: codeError,
      description: !description.trim() ? "Description is required" : "",
    });

    if (categoryError || codeError || !description.trim()) {
      setIsSubmitting(false);
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const branchManagerId = currentUser?._id;

    if (!branchManagerId) {
      setMessage("You must be logged in as a branch manager to register categories.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      code,
      description,
      category,
      branchManagerId,
    };

    try {
      const checkResponse = await axios.get(
        `http://localhost:3001/check-code?code=${code}&branchManagerId=${branchManagerId}`
      );

      if (checkResponse.data.exists) {
        setErrors((prev) => ({ ...prev, code: "This code already exists" }));
        setIsSubmitting(false);
        return;
      }

      const response = await axios.post("http://localhost:3001/category", payload);

      setMessage("Category registered successfully.");
      setCode("");
      setDescription("");
      setCategory("");
    } catch (error) {
      setMessage(`Error: ${error.response ? error.response.data.error : error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div
        className="w-full max-w-xl p-8 rounded-lg shadow-lg"
        style={{ maxWidth: "500px", backgroundColor: "#1c1c2e" }}
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-400">Set Category</h1>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-4">
              <label htmlFor="category" className="block font-medium text-gray-300 mb-1">
                Category Name:
              </label>
              <input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                onBlur={() => handleBlur("category")}
                className={`w-full px-3 py-2 bg-gray-800 border ${
                  errors.category ? "border-red-500" : "border-gray-600"
                } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            <div className="w-full md:w-1/2 px-3 mb-4">
              <label htmlFor="code" className="block font-medium text-gray-300 mb-1">
                Code:
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onBlur={() => handleBlur("code")}
                className={`w-full px-3 py-2 bg-gray-800 border ${
                  errors.code ? "border-red-500" : "border-gray-600"
                } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block font-medium text-gray-300 mb-1">
              Description:
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-3 py-2 bg-gray-800 border ${
                errors.description ? "border-red-500" : "border-gray-600"
              } rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-500 transition duration-300 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Registering..." : "Register Category"}
            </button>
          </div>

          {message && (
            <p
              className={`text-sm mt-4 text-center ${
                message.includes("successfully") ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Category;