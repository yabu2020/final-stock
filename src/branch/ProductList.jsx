import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editData, setEditData] = useState({});
  const [message, setMessage] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState(""); // Alert state
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const branchManagerId = currentUser?._id;

        if (!branchManagerId) {
          setMessage("You must be logged in as a branch manager to view products.");
          return;
        }

        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get("http://localhost:3001/productlist", {
            params: { branchManagerId },
          }),
          axios.get("http://localhost:3001/categories", {
            params: { branchManagerId },
          }),
        ]);

        console.log("Products Response:", productsResponse.data); // Log the response
        console.log("Categories Response:", categoriesResponse.data);

        setProducts(productsResponse.data.products);
        setCategories(categoriesResponse.data);

        checkStockLevels(productsResponse.data.products);
      } catch (error) {
        setMessage(`Error: ${error.response ? error.response.data.message : error.message}`);
      }
    };
    fetchData();
  }, []);

  const checkStockLevels = (products) => {
    const lowStockProducts = products.flatMap(categoryGroup => categoryGroup.products).filter(product => product.status === 'Low Stock');
    const outOfStockProducts = products.flatMap(categoryGroup => categoryGroup.products).filter(product => product.status === 'Out Of Stock');

    const lowStockNames = lowStockProducts.map(product => product.name).join(', ');
    const outOfStockNames = outOfStockProducts.map(product => product.name).join(', ');

    let alertMessage = '';

    if (lowStockProducts.length > 0) {
      alertMessage += `Alert: The following products are low on stock: ${lowStockNames}. `;
    }

    if (outOfStockProducts.length > 0) {
      alertMessage += `Alert: The following products are out of stock: ${outOfStockNames}.`;
    }

    setAlert(alertMessage || ""); // Clear alert if no issues
  };

  const startEditing = (product) => {
    setEditingProduct(product._id);
    setEditData({ ...product });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

  const saveChanges = (productId) => {
    let newStatus;
    if (editData.quantity === 0) {
      newStatus = 'Out Of Stock';
    } else if (editData.quantity < 5) {
      newStatus = 'Low Stock';
    } else {
      newStatus = 'Available';
    }

    axios
      .put(`http://localhost:3001/updateproduct/${productId}`, {
        ...editData,
        status: newStatus,
      })
      .then((response) => {
        setProducts((prevProducts) =>
          prevProducts.map((categoryGroup) => ({
            ...categoryGroup,
            products: categoryGroup.products.map((product) =>
              product._id === productId ? response.data : product
            ),
          }))
        );
        checkStockLevels(products); // Check stock levels after saving
        setEditingProduct(null);
        setEditData({});
        toast.success("Product updated successfully"); // ✅ Show success toast
      })
      .catch((error) => {
        setMessage(`Error: ${error.response ? error.response.data.message : error.message}`);
      });
  };

  const cancelEditing = () => {
    setEditingProduct(null);
    setEditData({});
  };

  const deleteProduct = (productId) => {
    axios
      .delete(`http://localhost:3001/deleteproduct/${productId}`)
      .then(() => {
        setProducts((prevProducts) =>
          prevProducts
            .map((categoryGroup) => ({
              ...categoryGroup,
              products: categoryGroup.products.filter((product) => product._id !== productId),
            }))
            .filter((categoryGroup) => categoryGroup.products.length > 0)
        );
        checkStockLevels(products); // Check stock levels after deleting
        toast.success("Product deleted successfully"); // ✅ Show success toast
      })
      .catch((error) => {
        setMessage(`Error: ${error.response ? error.response.data.message : error.message}`);
      });
  };

  const categoryMap = categories.reduce((map, category) => {
    map[category._id] = category.category;
    return map;
  }, {});

  // Filter products based on the search query
  const filteredProducts = products.map(categoryGroup => ({
    ...categoryGroup,
    products: categoryGroup.products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categoryMap[product.category]?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(categoryGroup => categoryGroup.products.length > 0); // Remove empty categories

  return (
    <div className="mt-10 ml-80 lg:ml-20">
      {/* Header Section */}
      <div className="bg-gray-900 p-4 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold text-2xl text-blue-400">List of Products</h1>
          <Link to="/manager/addproduct">
            <button className="bg-blue-600 w-28 h-11 justify-around text-white hover:bg-blue-500 transition duration-300 rounded-md">
              New Products
            </button>
          </Link>
        </div>
        {message && (
          <p className="text-green-500 text-md font-medium mt-2">{message}</p>
        )}
      </div>

      {/* Alert Section */}
      {alert && <p className="text-red-500 font-bold mb-6">{alert}</p>}

      {/* Search Bar */}
      <div className="bg-gray-900 p-4 rounded-lg shadow-md mb-6">
        <input
          type="text"
          placeholder="Search products by name, description, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Product List */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-md overflow-x-auto">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((categoryGroup, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                {categoryMap[categoryGroup._id] || "Unknown Category"}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] bg-gray-800 rounded-lg">
                  <thead>
                    <tr>
                      {/* <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-gray-300 py-2 px-3 bg-gray-700 text-left">
                        Image
                      </th> */}
                      <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-gray-300 py-2 px-3 bg-gray-700 text-left">
                        Product Name
                      </th>
                      <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-gray-300 py-2 px-3 bg-gray-700 text-left">
                        Quantity
                      </th>
                      <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-gray-300 py-2 px-3 bg-gray-700 text-left">
                        Purchase Price
                      </th>
                      <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-gray-300 py-2 px-3 bg-gray-700 text-left">
                        Selling Price
                      </th>
                      <th
                        className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-gray-300 py-2 px-3 bg-gray-700 text-left"
                        style={{ display: window.innerWidth < 768 ? 'none' : 'table-cell' }}
                      >
                        Description
                      </th>
                      <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-gray-300 py-2 px-3 bg-gray-700 text-left">
                        Status
                      </th>
                      <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-gray-300 py-2 px-3 bg-gray-700 text-left">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryGroup.products.map((product) => (
                      <tr
                        key={product._id}
                        className="hover:bg-gray-600 transition duration-300"
                      >
                        {/* <td className="py-2 px-4 border-b border-gray-600 text-center">
                          {product.image ? (
                            <img
                              src={`http://localhost:3001${product.image}`} // Prepend the backend URL
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ) : (
                            <span className="text-gray-400">No Image</span>
                          )}
                        </td> */}
                        <td className="py-2 px-4 border-b border-gray-600 text-gray-300">
                          {editingProduct === product._id ? (
                            <input
                              type="text"
                              name="name"
                              value={editData.name}
                              onChange={handleInputChange}
                              className="border p-1 w-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              style={{ maxWidth: "120px" }}
                            />
                          ) : (
                            product.name
                          )}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-600 text-gray-300">
                          {editingProduct === product._id ? (
                            <input
                              type="number"
                              name="quantity"
                              value={editData.quantity}
                              onChange={handleInputChange}
                              className="border p-1 w-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              style={{ maxWidth: "120px" }}
                            />
                          ) : (
                            product.quantity
                          )}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-600 text-gray-300">
                          {editingProduct === product._id ? (
                            <input
                              type="number"
                              name="purchaseprice"
                              value={editData.purchaseprice}
                              onChange={handleInputChange}
                              className="border p-1 w-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              style={{ maxWidth: "120px" }}
                            />
                          ) : (
                            product.purchaseprice
                          )}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-600 text-gray-300">
                          {editingProduct === product._id ? (
                            <input
                              type="number"
                              name="saleprice"
                              value={editData.saleprice}
                              onChange={handleInputChange}
                              className="border p-1 w-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              style={{ maxWidth: "120px" }}
                            />
                          ) : (
                            product.saleprice
                          )}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-600 text-gray-300">
                          {editingProduct === product._id ? (
                            <input
                              type="text"
                              name="description"
                              value={editData.description}
                              onChange={handleInputChange}
                              className="border p-1 w-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              style={{ maxWidth: "120px" }}
                            />
                          ) : (
                            product.description
                          )}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-600 text-gray-300">
                          {editingProduct === product._id ? (
                            <input
                              type="text"
                              name="status"
                              value={editData.status}
                              onChange={handleInputChange}
                              className="border p-1 w-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              style={{ maxWidth: "120px" }}
                            />
                          ) : (
                            product.status
                          )}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-600 text-gray-300">
                          {editingProduct === product._id ? (
                            <>
                              <button
                                onClick={() => saveChanges(product._id)}
                                className="text-blue-400 hover:underline mr-4"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="text-red-400 hover:underline"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditing(product)}
                                className="hover:text-blue-400 hover:cursor-pointer mr-4"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(product._id)}
                                className="hover:text-red-400 hover:cursor-pointer"
                              >
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No products found.</p>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmDeleteId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "#1f2937",
              padding: "1.5rem",
              borderRadius: "8px",
              maxWidth: "400px",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            <h3 style={{ color: "white", marginBottom: "1rem" }}>
              Are you sure you want to delete this product?
            </h3>
            <div>
              <button
                onClick={() => {
                  handleDelete(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                style={{
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "0.5rem 1rem",
                  marginRight: "1rem",
                  cursor: "pointer",
                }}
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                style={{
                  backgroundColor: "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default ProductList;