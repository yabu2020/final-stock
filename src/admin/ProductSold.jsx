import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import debounce from 'lodash.debounce';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductSold() {
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [assignedProducts, setAssignedProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchAssignedProducts();
  }, [searchTerm]);

  const fetchProducts = useCallback(debounce(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const branchManagerId = currentUser?._id;
  
    if (!branchManagerId) {
      setMessage("You must be logged in as a branch manager to sell products.");
      return;
    }
  
    axios
      .get("http://localhost:3001/productlist", { 
        params: { branchManagerId } // Pass branchManagerId as a query parameter
      })
      .then((response) => {
        console.log("Products response:", response.data); // Log the response
  
        // Extract products from the response
        const groupedProducts = response.data.products || [];
        const filteredProducts = groupedProducts.flatMap(category =>
          category.products.filter(product => 
            product.status === "Available" || product.status === "Low Stock"
          )
        );
  
        setProducts(filteredProducts);
      })
      .catch((error) => setMessage(`Error fetching products: ${error.message}`));
  }, 300), []);
  const fetchAssignedProducts = useCallback(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const branchManagerId = currentUser?._id;
  
    if (!branchManagerId) {
      setMessage("You must be logged in as a branch manager to view sold products.");
      return;
    }
  
    axios
      .get("http://localhost:3001/assigned-products", { 
        params: { branchManagerId } // Pass branchManagerId as a query parameter
      })
      .then((response) => {
        console.log("Assigned products response:", response.data); // Log the response
        setAssignedProducts(response.data);
      })
      .catch((error) => setMessage(`Error fetching assigned products: ${error.message}`));
  }, []);

  const handleGiveProduct = () => {
    if (!selectedProduct || quantity <= 0) {
      setMessage("Please select a product and enter a valid quantity.");
      return;
    }
  
    const product = products.find(a => a._id === selectedProduct);
    if (!product) {
      setMessage("Selected product not found.");
      return;
    }
  
    const totalPrice = product.saleprice * quantity;
  
    axios
      .post("http://localhost:3001/sellproduct", {
        productId: selectedProduct,
        quantity,
        totalPrice,
        branchManagerId: JSON.parse(localStorage.getItem("currentUser"))._id,
      })
      .then((response) => {
        console.log("Response received:", response.data);
  
        // Show notification based on asset status
        const status = response.data.status;
        if (status === 'Out Of Stock') {
          toast.error("Alert: The product is now out of stock!");
        } else if (status === 'Low Stock') {
          toast.warn("Alert: The product is low on stock!");
        }
  
        setMessage("Product sold successfully");
  
        // Clear the success message after 3 seconds
        setTimeout(() => {
          setMessage("");
        }, 3000);
  
        fetchProducts(); // Refresh the product list after selling
        fetchAssignedProducts(); // Refresh the sold products list
        setSelectedProduct("");
        setQuantity(1); // Reset quantity
      })
      .catch((error) => {
        console.error("Error during product sale:", error);
        const errorMsg = error.response?.data?.error || error.message;
      
        // Check if the error is due to insufficient stock
        if (errorMsg.includes("Insufficient stock")) {
          setMessage(errorMsg); // Display the friendly message from the backend
        } else {
          setMessage(`Error assigning product: ${errorMsg}`); // Generic error message
        }
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 ml-60 rounded-lg shadow-md bg-white">
      <h2 className="text-3xl mt-4 font-bold text-blue-400 mb-6">Sell Product</h2>
      {message && (
  <p className={`text-lg mb-4 ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
    {message}
  </p>
)}
      
      <ToastContainer /> {/* Add ToastContainer for notifications */}
      
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <label htmlFor="search" className="block text-lg font-medium text-gray-500 mb-2 ml-2">Search Product:</label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Search for products"
            />
            <label htmlFor="product-select" className="block text-lg font-medium text-gray-500 mb-2"></label>
            <select
  id="product-select"
  value={selectedProduct}
  onChange={(e) => setSelectedProduct(e.target.value)}
  className="w-full sm:w-64 md:w-80 lg:w-96 px-4 py-2 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
>
  <option value="" disabled>Select a Product</option>
  {products.length > 0 ? (
    products.map((product) => (
      <option key={product._id} value={product._id}>
        {product.productno} - {product.name} - {product.saleprice} ({product.status})
      </option>
    ))
  ) : (
    <option value="" disabled>No products available</option>
  )}
</select>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <label htmlFor="quantity" className="block text-lg font-medium text-gray-500 mb-2">Quantity:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
            min="1"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Enter quantity"
          />
        </div>
      </div>

      <button
        onClick={handleGiveProduct}
        className="px-6 py-3 bg-blue-500 ml-80 text-white font-semibold rounded-md shadow-md hover:bg-blue-400 transition duration-300"
      >
        Sell Product
      </button>

      <h3 className="text-xl font-semibold text-gray-500 mt-10">Sold Products</h3>
      <table className="w-full mt-6 border-collapse bg-white shadow-md rounded-lg">
  <thead>
    <tr className="bg-gray-100 text-blue-400">
      <th className="px-4 py-2">Product ID</th>
      <th className="px-4 py-2">Product Name</th>
      <th className="px-4 py-2">Sale Price</th>
      <th className="px-4 py-2">Cost Price</th>
      <th className="px-4 py-2">Quantity</th>
      <th className="px-4 py-2">Total Price</th>
      <th className="px-4 py-2">Date</th>
    </tr>
  </thead>
  <tbody>
    {assignedProducts.length > 0 ? (
      assignedProducts.map((assignment, index) => (
        <tr key={index} className="border-b">
          <td className="px-4 py-2">{assignment.product?.productno || "N/A"}</td>
          <td className="px-4 py-2">{assignment.product?.name || "N/A"}</td>
          <td className="px-4 py-2">{assignment.product?.saleprice || "N/A"}</td>
          <td className="px-4 py-2">{assignment.costPrice || "N/A"}</td>
          <td className="px-4 py-2">{assignment.quantity || "N/A"}</td>
          <td className="px-4 py-2">{assignment.totalPrice || "N/A"}</td>
          <td className="px-4 py-2">{new Date(assignment.dateAssigned).toLocaleDateString()}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="7" className="text-center py-4 text-blue-500">No products sold</td>
      </tr>
    )}
  </tbody>
</table>
    </div>
  );
}

export default ProductSold;
