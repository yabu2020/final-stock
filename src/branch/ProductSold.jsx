import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductSold() {
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [assignedProducts, setAssignedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts("");
    fetchAssignedProducts();
  }, []);

  const fetchProducts = useCallback(
    debounce((search = "") => {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const branchManagerId = currentUser?._id;

      if (!branchManagerId) {
        setMessage("You must be logged in as a branch manager to sell products.");
        return;
      }

      axios
        .get("http://localhost:3001/productlist", {
          params: { branchManagerId, search },
        })
        .then((response) => {
          const groupedProducts = response.data.products || [];
          const filteredProducts = groupedProducts
            .flatMap((category) =>
              category.products.filter(
                (product) =>
                  (product.status === "Available" || product.status === "Low Stock") &&
                  product.name.toLowerCase().includes(search.toLowerCase())
              )
            );

          setProducts(filteredProducts);
        })
        .catch((error) => setMessage(`Error fetching products: ${error.message}`));
    }, 300),
    []
  );

  const fetchAssignedProducts = useCallback(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const branchManagerId = currentUser?._id;

    if (!branchManagerId) {
      setMessage("You must be logged in as a branch manager to view sold products.");
      return;
    }

    axios
      .get("http://localhost:3001/assigned-products", {
        params: { branchManagerId },
      })
      .then((response) => {
        setAssignedProducts(response.data);
      })
      .catch((error) => setMessage(`Error fetching assigned products: ${error.message}`));
  }, []);

  const handleInputChange = (inputValue) => {
    fetchProducts(inputValue);
  };

  const handleGiveProduct = () => {
    if (!selectedProduct || quantity <= 0) {
      setMessage("Please select a product and enter a valid quantity.");
      return;
    }

    const product = products.find((p) => p._id === selectedProduct.value);
    if (!product) {
      setMessage("Selected product not found.");
      return;
    }

    const totalPrice = product.saleprice * quantity;

    axios
      .post("http://localhost:3001/sellproduct", {
        productId: selectedProduct.value,
        quantity,
        totalPrice,
        branchManagerId: JSON.parse(localStorage.getItem("currentUser"))._id,
      })
      .then((response) => {
        const status = response.data.status;
        if (status === "Out Of Stock") {
          toast.error("Alert: The product is now out of stock!");
        } else if (status === "Low Stock") {
          toast.warn("Alert: The product is low on stock!");
        }

        setMessage("Product sold successfully");

        setTimeout(() => {
          setMessage("");
        }, 3000);

        fetchProducts("");
        fetchAssignedProducts();
        setSelectedProduct(null);
        setQuantity(1);
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.error || error.message;
        if (errorMsg.includes("Insufficient stock")) {
          setMessage(errorMsg);
        } else {
          setMessage(`Error assigning product: ${errorMsg}`);
        }
      });
  };

  const productOptions = products.map((product) => ({
    value: product._id,
    label: `${product.name} (${product.status})`,
    product: product,
  }));

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-md bg-gray-900">
      <h2 className="text-3xl font-bold text-blue-400 mb-6">Sell Product</h2>

      {message && (
        <p className={`text-lg mb-4 ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
          {message}
        </p>
      )}

      <ToastContainer />

      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-300 mb-2">Select Product:</label>
        <Select
          options={productOptions}
          value={selectedProduct}
          onChange={setSelectedProduct}
          onInputChange={handleInputChange}
          placeholder="Search products..."
          isClearable
          styles={{
            control: (provided) => ({
              ...provided,
              backgroundColor: "#374151",
              borderColor: "#4B5563",
              color: "white",
              minHeight: "44px",
              width: "100%",
              maxWidth: "500px",
            }),
            input: (provided) => ({
              ...provided,
              color: "white",
              opacity: 1,
              width: "auto",
              minWidth: "100%",
              maxWidth: "500px",
            }),
            menu: (provided) => ({
              ...provided,
              backgroundColor: "#374151",
              maxHeight: "300px",
              overflow: "hidden",
              width: "auto",
              minWidth: "100%",
              maxWidth: "500px",
            }),
            menuList: (provided) => ({
              ...provided,
              maxHeight: "300px",
              padding: 0,
            }),
            singleValue: (provided) => ({
              ...provided,
              color: "white",
              maxWidth: "calc(100% - 20px)",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? "#2563EB" : "#374151",
              color: "white",
              cursor: "pointer",
              padding: "8px 12px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }),
          }}
          formatOptionLabel={({ label, product }) => (
            <div>
              <div style={{ fontWeight: 500 }}>{product.name}</div>
              <div style={{ fontSize: "0.8em", opacity: 0.8 }}>
                {product.saleprice} | {product.status}
              </div>
            </div>
          )}
          noOptionsMessage={() => "No products found"}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="quantity" className="block text-lg font-medium text-gray-300 mb-2">
          Quantity:
        </label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
          min="1"
          className="flex-1 px-4 py-2 border border-gray-600 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
          placeholder="Enter quantity"
        />
      </div>

      <button
        onClick={handleGiveProduct}
        className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-500 transition duration-300"
      >
        Sell Product
      </button>

      <h3 className="text-xl font-semibold text-gray-300 mt-10">Sold Products</h3>
      <div className="mb-4 mt-6">
        <input
          type="text"
          placeholder="Search sold products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full mt-6 border-collapse bg-gray-800 shadow-md rounded-lg min-w-[600px]">
          <thead>
            <tr className="bg-gray-700 text-gray-300">
              <th className="px-4 py-2">Product Name</th>
              <th className="px-4 py-2">Sale Price</th>
              <th className="px-4 py-2">Cost Price</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Total Price</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {assignedProducts
              .filter((assignment) =>
                assignment.product?.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((assignment, index) => (
                <tr key={index} className="border-b border-gray-600">
                  <td className="px-4 py-2 text-gray-300">{assignment.product?.name || "N/A"}</td>
                  <td className="px-4 py-2 text-gray-300">{assignment.product?.saleprice || "N/A"}</td>
                  <td className="px-4 py-2 text-gray-300">{assignment.costPrice || "N/A"}</td>
                  <td className="px-4 py-2 text-gray-300">{assignment.quantity || "N/A"}</td>
                  <td className="px-4 py-2 text-gray-300">{assignment.totalPrice || "N/A"}</td>
                  <td className="px-4 py-2 text-gray-300">
                    {new Date(assignment.dateAssigned).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            {assignedProducts.filter((assignment) =>
              assignment.product?.name.toLowerCase().includes(searchTerm.toLowerCase())
            ).length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-400">
                  No matching sold products
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductSold;