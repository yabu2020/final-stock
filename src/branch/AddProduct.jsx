import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

function AddProduct() {
  const [name, setName] = useState("");
  const [purchaseprice, setPurchaseprice] = useState("");
  const [saleprice, setSaleprice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !purchaseprice || !saleprice || !category || !image) {
      setMessage("Please fill in all fields and upload an image.");
      return;
    }

    const purchasePrice = parseFloat(purchaseprice);
    const salePrice = parseFloat(saleprice);

    if (isNaN(purchasePrice) || isNaN(salePrice)) {
      setMessage("Purchase price and sale price must be valid numbers.");
      return;
    }

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
      })
      .catch((error) => {
        setMessage(`Error: ${error.response?.data?.message || error.message}`);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div
        className="w-full max-w-lg p-8 rounded-lg shadow-lg"
        style={{ maxWidth: "780px", backgroundColor: "#1f2937" }}
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-400">
          Add Product
        </h1>

        {message && (
          <p
            className={`text-sm mt-4 text-center ${
              message.includes("successfully") ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Product Name & Category */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label htmlFor="name" className="block font-medium text-gray-300 mb-1">
                Product Name:
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>

            <div className="w-full md:w-1/2 px-3">
              <label htmlFor="category" className="block font-medium text-gray-300 mb-1">
                Category:
              </label>
              <Select
                id="category"
                options={categories.map((cat) => ({
                  value: cat._id,
                  label: `${cat.category} (Code: ${cat.code})`,
                }))}
                onChange={(selectedOption) => setCategory(selectedOption?.value || "")}
                placeholder="Select or search category"
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: "#1f2937",
                    borderColor: "#4b5563",
                    color: "#fff",
                  }),
                  input: (base) => ({
                    ...base,
                    color: "#fff",
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: "#fff",
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: "#1f2937",
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? "#3b82f6" : "#1f2937",
                    color: "#fff",
                  }),
                }}
              />
            </div>
          </div>

          {/* Row 2: Purchase Price & Sale Price */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label htmlFor="purchaseprice" className="block font-medium text-gray-300 mb-1">
                Purchase Price:
              </label>
              <input
                type="number"
                id="purchaseprice"
                value={purchaseprice}
                onChange={(e) => setPurchaseprice(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>

            <div className="w-full md:w-1/2 px-3">
              <label htmlFor="saleprice" className="block font-medium text-gray-300 mb-1">
                Sale Price:
              </label>
              <input
                type="number"
                id="saleprice"
                value={saleprice}
                onChange={(e) => setSaleprice(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
          </div>

          {/* Row 3: Description & Image */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label htmlFor="description" className="block font-medium text-gray-300 mb-1">
                Description:
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label htmlFor="image" className="block font-medium text-gray-300 mb-1">
                Product Image:
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-500 transition duration-300"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
