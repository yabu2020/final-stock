import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

function AddProduct() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const branchManagerId = currentUser?._id;

    if (!branchManagerId) {
      setMessage("You must be logged in as a branch manager to view products.");
      return;
    }

    axios
      .get("http://localhost:3001/productlist", {
        params: { branchManagerId },
      })
      .then((response) => {
        if (Array.isArray(response.data.products)) {
          const flattenedProducts = response.data.products.reduce((acc, group) => {
            return acc.concat(group.products || []);
          }, []);
          setProducts(flattenedProducts);
        } else {
          setMessage("Error: Invalid product data received.");
        }
      })
      .catch((error) => {
        setMessage("Error fetching products.");
        console.error(error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedProduct || !quantity) {
      setMessage("Please select a product and enter quantity.");
      return;
    }

    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      setMessage("Quantity must be a positive number.");
      return;
    }

    axios
      .post("http://localhost:3001/buyproduct", {
        productId: selectedProduct,
        quantity: parsedQuantity,
      })
      .then(() => {
        setMessage("Stock purchase recorded successfully.");
        setSelectedProduct("");
        setQuantity("");
      })
      .catch((error) => {
        setMessage(`Error: ${error.response?.data?.error || error.message}`);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-lg p-6 rounded-lg shadow-lg bg-gray-800">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-400">
          Add Product
        </h1>

        {message && (
          <p className={`text-sm mt-4 text-center ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-300 mb-1">
                Select Product:
              </label>
              <Select
                options={products.map((product) => ({
                  value: product._id,
                  label: product.name,
                }))}
                value={
                  selectedProduct
                    ? {
                        value: selectedProduct,
                        label: products.find((p) => p._id === selectedProduct)?.name || "Select",
                      }
                    : null
                }
                onChange={(option) => setSelectedProduct(option?.value || "")}
                placeholder="Select product"
                styles={selectStyles}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-300 mb-1">
                Quantity:
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-500 transition duration-300"
            >
              Record Purchase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const selectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "#1f2937",
    borderColor: "#4b5563",
    color: "white",
    minHeight: "42px",
  }),
  singleValue: (base) => ({
    ...base,
    color: "white",
  }),
  input: (base) => ({
    ...base,
    color: "white",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#1f2937",
    color: "white",
    zIndex: 9999,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#3b82f6" : "#1f2937",
    color: "white",
  }),
};

export default AddProduct;