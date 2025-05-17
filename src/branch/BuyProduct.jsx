import React, { useState, useEffect } from "react";
import axios from "axios";


function BuyProduct() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [quantity, setQuantity] = useState("");
    const [supplier, setSupplier] = useState("");
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
            console.log("Backend Response:", response.data); // Log the full response
      
            // Ensure response.data.products exists and is an array
            if (Array.isArray(response.data.products)) {
              const flattenedProducts = response.data.products.reduce((acc, group) => {
                return acc.concat(group.products || []); // Safely concatenate products
              }, []);
      
              console.log("Flattened Products:", flattenedProducts); // Log the flattened array
              setProducts(flattenedProducts);
            } else {
              console.error("Invalid data structure:", response.data);
              setMessage("Error: Invalid product data received.");
            }
          })
          .catch((error) => {
            console.error("Error fetching products:", error);
            setMessage("Error fetching products.");
          });
      }, []);
    const handleSubmit = (e) => {
      e.preventDefault();
  
      if (!selectedProduct || !quantity || !supplier) {
        setMessage("Please fill in all fields.");
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
          supplier,
        })
        .then((response) => {
          setMessage("Stock purchase recorded successfully.");
          setSelectedProduct("");
          setQuantity("");
          setSupplier("");
        })
        .catch((error) => {
          setMessage(`Error: ${error.response?.data?.error || error.message}`);
        });
    };
  
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div
          className="w-full max-w-lg p-8 rounded-lg shadow-lg"
          style={{ maxWidth: "780px", backgroundColor: "#1f2937" }}
        >
          <h1 className="text-2xl font-bold mb-6 text-center text-blue-400">
            Buy Product
          </h1>
  
          {/* Success/Error Message */}
          {message && (
            <p
              className={`text-sm mt-4 text-center ${
                message.includes("successfully") ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
  
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1: Product Selection & Quantity */}
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  htmlFor="product"
                  className="block font-medium text-gray-300 mb-1"
                >
                  Select Product:
                </label>
                <select
  id="product"
  value={selectedProduct}
  onChange={(e) => setSelectedProduct(e.target.value)}
  required
  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
>
  <option value="">Select a product</option>
  {products.map((product) => (
    <option key={product._id} value={product._id}>
      {product.name}
    </option>
  ))}
</select>
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label
                  htmlFor="quantity"
                  className="block font-medium text-gray-300 mb-1"
                >
                  Quantity:
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
              </div>
            </div>
  
            {/* Row 2: Supplier Details */}
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label
                  htmlFor="supplier"
                  className="block font-medium text-gray-300 mb-1"
                >
                  Supplier:
                </label>
                <input
                  type="text"
                  id="supplier"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
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
                Record Purchase
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  export default BuyProduct;