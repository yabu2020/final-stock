import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

function BuyProduct() {
  const [name, setName] = useState("");
  const [purchaseprice, setPurchaseprice] = useState("");
  const [saleprice, setSaleprice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    purchaseprice: "",
    saleprice: "",
    category: "",
    image: ""
  });

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const branchManagerId = currentUser?._id;
    if (!branchManagerId) {
      setMessage("You must be logged in as a branch manager to register products.");
      return;
    }
    axios
      .get("http://localhost:3001/categories", {
        params: { branchManagerId },
      })
      .then((response) => setCategories(response.data))
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setMessage("Error fetching categories.");
      });
  }, []);

  const validateName = (name) => {
    if (!name.trim()) return "Product name is required";
    if (/^\d+$/.test(name)) return "Product name cannot be only numbers";
    if (!/^[A-Za-z0-9\s]+$/.test(name)) return "Only letters and numbers allowed";
    return "";
  };

  const validatePrice = (price, fieldName) => {
    if (!price) return `${fieldName} is required`;
    if (isNaN(Number(price))) return "Must be a valid number";
    if (Number(price) <= 0) return "Must be greater than 0";
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {
      name: validateName(name),
      purchaseprice: validatePrice(purchaseprice, "Purchase price"),
      saleprice: validatePrice(saleprice, "Sale price"),
      category: !category ? "Category is required" : "",
      image: !image ? "Product image is required" : ""
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(error => error)) return;

    const purchasePrice = parseFloat(purchaseprice);
    const salePrice = parseFloat(saleprice);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("purchaseprice", purchasePrice);
    formData.append("saleprice", salePrice);
    formData.append("category", category);
    formData.append("image", image);

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You must be logged in to add a product.");
      return;
    }

    axios
      .post("http://localhost:3001/addproduct", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setMessage("Product added successfully.");
        setName("");
        setPurchaseprice("");
        setSaleprice("");
        setDescription("");
        setCategory("");
        setImage(null);
        setErrors({
          name: "",
          purchaseprice: "",
          saleprice: "",
          category: "",
          image: ""
        });
      })
      .catch((error) => {
        setMessage(`Error: ${error.response?.data?.message || error.message}`);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-lg p-8 rounded-lg shadow-lg" style={{ maxWidth: "780px", backgroundColor: "#1f2937" }}>
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-400">Buy Product</h1>
        {message && (
          <p className={`text-sm mt-4 text-center ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label htmlFor="name" className="block font-medium text-gray-300 mb-1">Product Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors(prev => ({ ...prev, name: validateName(e.target.value) }));
                }}
                className={`w-full px-3 py-2 bg-gray-800 border ${errors.name ? "border-red-500" : "border-gray-600"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label htmlFor="category" className="block font-medium text-gray-300 mb-1">Category:</label>
              <Select
                id="category"
                options={categories.map((cat) => ({
                  value: cat._id,
                  label: `${cat.category} (Code: ${cat.code})`,
                }))}
                onChange={(selectedOption) => {
                  setCategory(selectedOption?.value || "");
                  setErrors(prev => ({ ...prev, category: !selectedOption?.value ? "Category is required" : "" }));
                }}
                placeholder="Select or search category"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    backgroundColor: "#1f2937",
                    borderColor: errors.category ? "#ef4444" : "#4b5563",
                    color: "#fff",
                  }),
                  input: (base) => ({ ...base, color: "#fff" }),
                  singleValue: (base) => ({ ...base, color: "#fff" }),
                  menu: (base) => ({ ...base, backgroundColor: "#1f2937" }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? "#3b82f6" : "#1f2937",
                    color: "#fff",
                  }),
                }}
              />
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label htmlFor="purchaseprice" className="block font-medium text-gray-300 mb-1">Purchase Price:</label>
              <input
                type="number"
                id="purchaseprice"
                value={purchaseprice}
                onChange={(e) => {
                  setPurchaseprice(e.target.value);
                  setErrors(prev => ({ ...prev, purchaseprice: validatePrice(e.target.value, "Purchase price") }));
                }}
                step="0.01"
                min="0"
                className={`w-full px-3 py-2 bg-gray-800 border ${errors.purchaseprice ? "border-red-500" : "border-gray-600"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white`}
              />
              {errors.purchaseprice && <p className="text-red-500 text-xs mt-1">{errors.purchaseprice}</p>}
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label htmlFor="saleprice" className="block font-medium text-gray-300 mb-1">Sale Price:</label>
              <input
                type="number"
                id="saleprice"
                value={saleprice}
                onChange={(e) => {
                  setSaleprice(e.target.value);
                  setErrors(prev => ({ ...prev, saleprice: validatePrice(e.target.value, "Sale price") }));
                }}
                step="0.01"
                min="0"
                className={`w-full px-3 py-2 bg-gray-800 border ${errors.saleprice ? "border-red-500" : "border-gray-600"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white`}
              />
              {errors.saleprice && <p className="text-red-500 text-xs mt-1">{errors.saleprice}</p>}
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label htmlFor="description" className="block font-medium text-gray-300 mb-1">Description:</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label htmlFor="image" className="block font-medium text-gray-300 mb-1">Product Image:</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                  setErrors(prev => ({ ...prev, image: !e.target.files[0] ? "Product image is required" : "" }));
                }}
                className={`w-full px-3 py-2 bg-gray-800 border ${errors.image ? "border-red-500" : "border-gray-600"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white`}
              />
              {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-500 transition duration-300"
            >
              Buy Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BuyProduct;