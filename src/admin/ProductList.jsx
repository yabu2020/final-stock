import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editData, setEditData] = useState({});
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState(""); // Alert state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const branchManagerId = currentUser?._id;
  
        if (!branchManagerId) {
          setMessage("You must be logged in as a branch manager to view products.");
          return;
        }
  
        // console.log("Fetching products for branchManagerId:", branchManagerId); // Log the branchManagerId
  
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get("http://localhost:3001/productlist", {
            params: { branchManagerId }, // Pass branchManagerId as a query parameter
          }),
          axios.get("http://localhost:3001/categories", {
            params: { branchManagerId }, // Pass branchManagerId as a query parameter
          }),
        ]);
        setProducts(productsResponse.data.products);
        setCategories(categoriesResponse.data);
  
        // Check stock levels
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
        setMessage("Product updated successfully");
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
            .filter((categoryGroup) => categoryGroup.products.length > 0) // Remove empty categories
        );
        checkStockLevels(products); // Check stock levels after deleting
        setMessage("Product deleted successfully");
      })
      .catch((error) => {
        setMessage(`Error: ${error.response ? error.response.data.message : error.message}`);
      });
  };

  const categoryMap = categories.reduce((map, category) => {
    map[category._id] = category.category;
    return map;
  }, {});

  return (
    <div className="grid grid-cols-1 mt-10 ml-80 lg:grid-cols-1 gap-6 w-80">
      <div className="flex justify-between w-80">
        <div>
          <h1 className="font-semibold text-2xl text-blue-400 bg-gray-50">List of Products</h1>
        </div>
        <div className="flex-grow self-end text-right">
          <Link to="/registerproduct">
            <button className="bg-blue-400 w-28 h-11 justify-around hover:text-white items-center hover:bg-blue-300">
              New Products
            </button>
          </Link>
        </div>
        {message && <p className="text-gray-300 text-md font-medium hover:text-green-500 ml-20">{message}</p>}
      </div>
      {alert && <p className="text-red-500 font-bold">{alert}</p>} {/* Display alert message */}
      <div>
        {products.length > 0 ? (
          products.map((categoryGroup, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {categoryMap[categoryGroup._id] || "Unknown Category"}
              </h2>
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr>
                  <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-gray-600 py-2 px-3 bg-gray-50 text-left rounded-bl-md">Image</th>
                    <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-gray-600 py-2 px-3 bg-gray-50 text-left rounded-bl-md">Product Name</th>
                    <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-gray-600 py-2 px-3 bg-gray-50 text-left rounded-bl-md">Quantity</th>
                    <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-gray-600 py-2 px-3 bg-gray-50 text-left rounded-bl-md">Purchase Price</th>
                    <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-gray-600 py-2 px-3 bg-gray-50 text-left rounded-bl-md">Selling Price</th>
                    <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-gray-600 py-2 px-3 bg-gray-50 text-left rounded-bl-md">Description</th>
                    <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-gray-600 py-2 px-3 bg-gray-50 text-left rounded-bl-md">Status</th>
                    <th className="text-[15px] uppercase border border-solid tracking-wide font-semibold text-gray-600 py-2 px-3 bg-gray-50 text-left rounded-bl-md">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryGroup.products.length > 0 ? (
                    categoryGroup.products.map((product) => (
                      <tr key={product._id}>
                        <td className="py-2 px-4 border-b border-gray-200">{product.image ? ( <img src={`http://localhost:3001/${product.image}`}alt={product.name}className="w-16 h-16 object-cover rounded-md" /> ) : ( <span>No Image</span> )}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{editingProduct === product._id ? <input type="text" name="name" value={editData.name} onChange={handleInputChange} className="border p-1 w-full" style={{ maxWidth: '120px' }} /> : product.name}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{editingProduct === product._id ? <input type="number" name="quantity" value={editData.quantity} onChange={handleInputChange} className="border p-1 w-full" style={{ maxWidth: '120px' }} /> : product.quantity}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{editingProduct === product._id ? <input type="number" name="purchaseprice" value={editData.purchaseprice} onChange={handleInputChange} className="border p-1 w-full" style={{ maxWidth: '120px' }} /> : product.purchaseprice}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{editingProduct === product._id ? <input type="number" name="saleprice" value={editData.saleprice} onChange={handleInputChange} className="border p-1 w-full" style={{ maxWidth: '120px' }} /> : product.saleprice}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{editingProduct === product._id ? <input type="text" name="description" value={editData.description} onChange={handleInputChange} className="border p-1 w-full" style={{ maxWidth: '120px' }} /> : product.description}</td>
                        <td className="py-2 px-4 border-b border-gray-200">{editingProduct === product._id ? <input type="text" name="status" value={editData.status} onChange={handleInputChange} className="border p-1 w-full" style={{ maxWidth: '120px' }} /> : product.status}</td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          {editingProduct === product._id ? (
                            <>
                              <button onClick={() => saveChanges(product._id)} className="text-blue-500 hover:underline mr-4">Save</button>
                              <button onClick={cancelEditing} className="text-red-500 hover:underline">Cancel</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => startEditing(product)} className="hover:text-blue-700 hover:cursor-pointer mr-4"><FaEdit /></button>
                              <button onClick={() => deleteProduct(product._id)} className="hover:text-red-500 hover:cursor-pointer"><FaTrash /></button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="py-2 px-4 border-b border-gray-200 text-center">No products found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p className="text-center text-blue-500">Loading products...</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
