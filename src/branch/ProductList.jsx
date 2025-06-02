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
  const [alert, setAlert] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editErrors, setEditErrors] = useState({
    name: "",
    quantity: "",
    purchaseprice: "",
    saleprice: "",
    description: ""
  });

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
          axios.get("http://localhost:3001/productlist", { params: { branchManagerId } }),
          axios.get("http://localhost:3001/categories", { params: { branchManagerId } }),
        ]);
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
    const lowStockProducts = products.flatMap(categoryGroup => categoryGroup.products)
      .filter(product => product.status === 'Low Stock');
    const outOfStockProducts = products.flatMap(categoryGroup => categoryGroup.products)
      .filter(product => product.status === 'Out Of Stock');
    const lowStockNames = lowStockProducts.map(product => product.name).join(', ');
    const outOfStockNames = outOfStockProducts.map(product => product.name).join(', ');
    let alertMessage = '';
    if (lowStockProducts.length > 0) {
      alertMessage += `Alert: The following products are low on stock: ${lowStockNames}. `;
    }
    if (outOfStockProducts.length > 0) {
      alertMessage += `Alert: The following products are out of stock: ${outOfStockNames}.`;
    }
    setAlert(alertMessage || "");
  };

  const validateName = (name) => {
    if (!name.trim()) return "Name is required";
    if (/^\d+$/.test(name)) return "Name cannot be only numbers";
    if (!/^[A-Za-z0-9\s]+$/.test(name)) return "Only letters and numbers allowed";
    return "";
  };

  const validateNumber = (value, fieldName) => {
    if (!value && value !== 0) return `${fieldName} is required`;
    if (isNaN(Number(value))) return "Must be a valid number";
    if (Number(value) < 0) return "Cannot be negative";
    return "";
  };

  const startEditing = (product) => {
    setEditingProduct(product._id);
    setEditData({ ...product });
    setEditErrors({
      name: "",
      quantity: "",
      purchaseprice: "",
      saleprice: "",
      description: ""
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
    if (name === "name") {
      setEditErrors(prev => ({ ...prev, name: validateName(value) }));
    } else if (name === "quantity") {
      setEditErrors(prev => ({ ...prev, quantity: validateNumber(value, "Quantity") }));
    } else if (name === "purchaseprice") {
      setEditErrors(prev => ({ ...prev, purchaseprice: validateNumber(value, "Purchase price") }));
    } else if (name === "saleprice") {
      setEditErrors(prev => ({ ...prev, saleprice: validateNumber(value, "Sale price") }));
    }
  };

  const validateEditForm = () => {
    const newErrors = {
      name: validateName(editData.name),
      quantity: validateNumber(editData.quantity, "Quantity"),
      purchaseprice: validateNumber(editData.purchaseprice, "Purchase price"),
      saleprice: validateNumber(editData.saleprice, "Sale price"),
      description: ""
    };
    setEditErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const saveChanges = (productId) => {
    if (!validateEditForm()) return;
    let newStatus;
    if (editData.quantity === 0) {
      newStatus = 'Out Of Stock';
    } else if (editData.quantity < 5) {
      newStatus = 'Low Stock';
    } else {
      newStatus = 'Available';
    }
    axios
      .put(`http://localhost:3001/updateproduct/${productId}`, { ...editData, status: newStatus })
      .then((response) => {
        setProducts((prevProducts) =>
          prevProducts.map((categoryGroup) => ({
            ...categoryGroup,
            products: categoryGroup.products.map((product) =>
              product._id === productId ? { ...response.data, status: newStatus } : product
            ),
          }))
        );
        checkStockLevels(products);
        setEditingProduct(null);
        setEditData({});
        toast.success("Product updated successfully");
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
        checkStockLevels(products);
        toast.success("Product deleted successfully");
        setConfirmDeleteId(null);
      })
      .catch((error) => {
        setMessage(`Error: ${error.response ? error.response.data.message : error.message}`);
      });
  };

  const categoryMap = categories.reduce((map, category) => {
    map[category._id] = category.category;
    return map;
  }, {});

  const filteredProducts = products.map(categoryGroup => ({
    ...categoryGroup,
    products: categoryGroup.products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categoryMap[product.category]?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(categoryGroup => categoryGroup.products.length > 0);

  return (
    <div className="mt-10 ml-80 lg:ml-20">
      <div className="bg-gray-900 p-4 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold text-2xl text-blue-400">List of Products</h1>
          <Link to="/manager/buyproduct">
            <button className="bg-blue-600 w-28 h-11 justify-around text-white hover:bg-blue-500 transition duration-300 rounded-md">
              New Products
            </button>
          </Link>
        </div>
        {message && (
          <p className="text-green-500 text-md font-medium mt-2">{message}</p>
        )}
      </div>
      {alert && <p className="text-red-500 font-bold mb-6">{alert}</p>}
      <div className="bg-gray-900 p-4 rounded-lg shadow-md mb-6">
        <input
          type="text"
          placeholder="Search products by name, description, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white focus:outline-none focus:border-blue-500"
        />
      </div>
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
                      <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-gray-300 py-2 px-3 bg-gray-700 text-left">
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
                      <tr key={product._id} className="hover:bg-gray-600 transition duration-300">
                        <td className="py-2 px-4 border-b border-gray-600 text-gray-300">
                          {editingProduct === product._id ? (
                            <div>
                              <input
                                type="text"
                                name="name"
                                value={editData.name}
                                onChange={handleInputChange}
                                className={`border p-1 w-full bg-gray-700 text-white focus:outline-none focus:ring-2 ${
                                  editErrors.name ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-blue-500"
                                }`}
                              />
                              {editErrors.name && <span className="text-red-500 text-xs">{editErrors.name}</span>}
                            </div>
                          ) : (
                            product.name
                          )}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-600 text-gray-300">
                          {editingProduct === product._id ? (
                            <div>
                              <input
                                type="number"
                                name="quantity"
                                value={editData.quantity}
                                onChange={handleInputChange}
                                className={`border p-1 w-full bg-gray-700 text-white focus:outline-none focus:ring-2 ${
                                  editErrors.quantity ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-blue-500"
                                }`}
                              />
                              {editErrors.quantity && <span className="text-red-500 text-xs">{editErrors.quantity}</span>}
                            </div>
                          ) : (
                            product.quantity
                          )}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-600 text-gray-300">
                          {editingProduct === product._id ? (
                            <div>
                              <input
                                type="number"
                                name="purchaseprice"
                                value={editData.purchaseprice}
                                onChange={handleInputChange}
                                step="0.01"
                                className={`border p-1 w-full bg-gray-700 text-white focus:outline-none focus:ring-2 ${
                                  editErrors.purchaseprice ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-blue-500"
                                }`}
                              />
                              {editErrors.purchaseprice && <span className="text-red-500 text-xs">{editErrors.purchaseprice}</span>}
                            </div>
                          ) : (
                            product.purchaseprice
                          )}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-600 text-gray-300">
                          {editingProduct === product._id ? (
                            <div>
                              <input
                                type="number"
                                name="saleprice"
                                value={editData.saleprice}
                                onChange={handleInputChange}
                                step="0.01"
                                className={`border p-1 w-full bg-gray-700 text-white focus:outline-none focus:ring-2 ${
                                  editErrors.saleprice ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-blue-500"
                                }`}
                              />
                              {editErrors.saleprice && <span className="text-red-500 text-xs">{editErrors.saleprice}</span>}
                            </div>
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
                            />
                          ) : (
                            product.description
                          )}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-600 text-gray-300">
                          {product.status === 'Available' ? (
                            <span className="text-green-400">{product.status}</span>
                          ) : product.status === 'Low Stock' ? (
                            <span className="text-yellow-400">{product.status}</span>
                          ) : (
                            <span className="text-red-400">{product.status}</span>
                          )}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-600 text-gray-300">
                          {editingProduct === product._id ? (
                            <>
                              <button
                                onClick={() => saveChanges(product._id)}
                                disabled={Object.values(editErrors).some(error => error)}
                                className={`text-blue-400 hover:underline mr-4 ${
                                  Object.values(editErrors).some(error => error) ? "opacity-50 cursor-not-allowed" : ""
                                }`}
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
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this product?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteProduct(confirmDeleteId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
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