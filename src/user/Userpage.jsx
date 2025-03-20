// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, Link } from 'react-router-dom';

// function UserPage() {
//   const { userId } = useParams();
//   const [assignedAssets, setAssignedAssets] = useState([]);
//   const [message, setMessage] = useState('');
//   const [hasError, setHasError] = useState(false);

//   useEffect(() => {
//     if (userId) {
//       fetchAssignedAssets(userId);
//     }
//   }, [userId]);

//   const fetchAssignedAssets = async (userId) => {
//     try {
//       const response = await axios.get(`http://localhost:3001/assigned-assets/${userId}`);
//       if (response.data.length === 0) {
//         setMessage('No assets assigned');
//         setAssignedAssets([]);
//       } else {
//         setAssignedAssets(response.data);
//         setMessage('');
//       }
//     } catch (error) {
//       setMessage(`Error: ${error.message}`);
//       setAssignedAssets([]);
//       setHasError(true);
//     }
//   };

//   return (
//     <div className="p-6 font-sans bg-gray-50 min-h-screen">
//       <h2 className="text-2xl font-bold text-gray-500 ml-10 mb-6">Your Assigned Assets</h2>
//       {hasError && <p className="text-red-600 text-lg mb-4">{message}</p>}
//       {!hasError && assignedAssets.length === 0 && <p className="text-gray-500 text-lg mb-4">{message}</p>}
      
//       {assignedAssets.length > 0 && (
//         <table className="w-full border-collapse ml-10 bg-white shadow-md rounded">
//           <thead className="bg-gray-200">
//             <tr>
//               <th className="py-3 px-4 text-left text-green-400">Asset Name</th>
//               <th className="py-3 px-4 text-left text-green-400">Asset SerialNo</th>
//               <th className="py-3 px-4 text-left text-green-400">Date Assigned</th>
//             </tr>
//           </thead>
//           <tbody>
//             {assignedAssets.map((assignment, index) => (
//               <tr key={index} className="border-b hover:bg-gray-50">
//                 <td className="py-3 px-4 text-gray-700">{assignment.asset?.name || 'N/A'}</td>
//                 <td className="py-3 px-4 text-gray-700">{assignment.asset?.serialno || 'N/A'}</td>
//                 <td className="py-3 px-4 text-gray-700">{new Date(assignment.dateAssigned).toLocaleDateString() || 'N/A'}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       <div className="mt-4 p-4 ml-10 bg-gray-100 w-80 shadow-md rounded-lg border border-gray-200">
//         <h3 className="text-lg font-semibold text-gray-500 mb-2">Manage Your Security Question</h3>
//         <p className="text-gray-600 text-sm mb-3">Update your security question to enhance your account security.</p>
//         <Link 
//           to={`/security-question/${userId}`} 
//           className="inline-block px-4 py-2 text-sm font-medium text-white bg-green-400 rounded-md shadow-sm hover:bg-green-500 transition duration-200"
//         >
//           Security Question Page
//         </Link>
//       </div>

//       <div className="mt-4 ml-10">
//         <Link 
//           to="/" 
//           className="inline-block px-4 py-2 text-sm font-medium text-white bg-green-400 rounded-md shadow-sm hover:bg-gray-400 transition duration-200"
//         >
//           Sign Out
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default UserPage;
import React, { useState, useEffect, useCallback, useContext } from "react";
import { useParams, Link } from 'react-router-dom';
import axios from "axios";
import debounce from 'lodash.debounce';
import UserContext from '../admin/UserContext'; // Adjust import path as needed

function Userpage() {
  const { userId } = useParams();
  const { cUSer } = useContext(UserContext); // Access current user from context
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]); // State for branches
  const [selectedBranch, setSelectedBranch] = useState(""); // State for selected branch
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const [message, setMessage] = useState("");
  const [orderHistory, setOrderHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state

  // Fetch branches on component mount
  useEffect(() => {
    axios
      .get("http://localhost:3001/branches")
      .then((response) => {
        setBranches(response.data);
      })
      .catch((error) => setMessage(`Error fetching branches: ${error.message}`));
  }, []);
  console.log("Branches fetched:", branches);
  // Define fetchProducts function with debounce
  const fetchProducts = useCallback(debounce(() => {
    if (!selectedBranch) return; // Only fetch products if a branch is selected
    console.log("Selected branch ID:", selectedBranch);
    // Find the branchManagerId for the selected branch
    const selectedBranchData = branches.find(branch => branch._id === selectedBranch);

// Check if the selected branch has a valid manager
if (!selectedBranchData || !selectedBranchData.manager?._id) {
  setMessage("This branch does not have a manager assigned.");
  return;
}

// Extract the branch manager ID from the manager object
const branchManagerId = selectedBranchData.manager._id;

// Fetch products for the selected branch manager
axios
  .get("http://localhost:3001/productlist", { 
    params: { 
      search: searchTerm,
      branchManagerId: branchManagerId // Pass the branch manager ID
    } 
  })
  .then((response) => {
    console.log('Products fetched:', response.data); // Debugging line
    const allProducts = response.data.products.flatMap(category => category.products);

    // Filter out products that are 'Out Of Stock'
    const filteredProducts = allProducts.filter(product =>
      product.status === 'Available' || product.status === 'Low Stock'
    );

    setProducts(filteredProducts);
  })
  .catch((error) => setMessage(`Error fetching products: ${error.message}`));
  }, 300), [selectedBranch, searchTerm, branches]);

  // Fetch products when branch or search term changes
  useEffect(() => {
    if (selectedBranch) {
      fetchProducts();
    }
  }, [fetchProducts, selectedBranch]);

  // Fetch order history on component mount
  useEffect(() => {
    const userId = cUSer?._id; // Get the userId from the current logged-in user
    if (userId) {
      axios
        .get(`http://localhost:3001/orders?userId=${userId}`) // Fetch orders for the current user
        .then((response) => {
          setOrderHistory(response.data);
        })
        .catch((error) => setMessage(`Error fetching order history: ${error.message}`));
    }
  }, [cUSer]); // Re-fetch orders when the current user changes

  // Handle loading state
  useEffect(() => {
    if (cUSer !== null) {
      setLoading(false); // Set loading to false once user data is fetched
    }
  }, [cUSer]);

  const handlePlaceOrder = () => {
    if (!selectedProduct || quantity <= 0) {
      setMessage("Please select a product and enter a valid quantity.");
      return;
    }
  
    const product = products.find(p => p._id === selectedProduct);
    if (!product) {
      setMessage("Selected product not found.");
      return;
    }
  
    const totalPrice = product.saleprice * quantity;
  
    // Retrieve the branchManagerId from the selected branch
    const selectedBranchData = branches.find(branch => branch._id === selectedBranch);
    if (!selectedBranchData || !selectedBranchData.manager?._id) {
      setMessage("This branch does not have a manager assigned.");
      return;
    }
  
    const branchManagerId = selectedBranchData.manager._id;
  
    // Use the current user's ID
    const userId = cUSer?._id; // Assuming `cUSer` contains the current user's data
  
    axios
      .post("http://localhost:3001/orders", {
        product: selectedProduct,
        quantity,
        totalPrice,
        userId, // Send userId
        branchManagerId, // Send branchManagerId
      })
      .then(() => {
        setMessage("Order placed successfully");
        axios
          .get(`http://localhost:3001/orders?userId=${userId}`)
          .then((response) => {
            setOrderHistory(response.data);
          })
          .catch((error) => setMessage(`Error fetching order history: ${error.message}`));
        setSelectedProduct("");
        setQuantity(1);
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.error || `Error placing order: ${error.message}`;
        const remainingStock = error.response?.data?.remainingStock;
        if (remainingStock) {
          setMessage(`Insufficient stock. You can only order up to ${remainingStock} units.`);
        } else {
          setMessage(errorMsg);
        }
      });
  };
  if (loading) {
    return <p>Loading...</p>; // Show loading message while user data is being fetched
  }

  if (!cUSer) {
    return <p>Unable to load user data. Please try again later.</p>; // Show error if user data is still missing
  }

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-md bg-white">
      <h2 className="text-3xl font-bold text-gray-400 mb-6">Welcome, {cUSer.name || "User"}!</h2>
      {message && <p className="text-red-500 text-lg mb-4">{message}</p>}

      {/* Branch Selection */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <label htmlFor="branch-select" className="block text-lg font-medium text-gray-500 mb-2">Select Branch:</label>
          <select
  id="branch-select"
  value={selectedBranch}
  onChange={(e) => setSelectedBranch(e.target.value)}
  className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
>
  <option value="" disabled>Select a Branch</option>
  {branches.map((branch) => (
    <option key={branch._id} value={branch._id}>
      {branch.branchName} - {branch.location}
    </option>
  ))}
</select>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <label htmlFor="search" className="block text-lg font-medium text-gray-500 mb-2">Search Product:</label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Search for products"
          />
        </div>
      </div>

      {/* Product Selection */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <label htmlFor="product-select" className="block text-lg font-medium text-gray-500 mb-2">Select Product:</label>
          <select
            id="product-select"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="" disabled>Select a Product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name} - ${product.saleprice}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quantity Input */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <label htmlFor="quantity" className="block text-lg font-medium text-gray-500 mb-2">Quantity:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => {
              const newQuantity = parseInt(e.target.value, 10) || 1;
              const product = products.find(p => p._id === selectedProduct);
              if (product && newQuantity > product.quantity) {
                setMessage(`You cannot order more than ${product.quantity} units.`);
              } else {
                setQuantity(newQuantity);
              }
            }}
            min="1"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter quantity"
          />
        </div>
      </div>

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-400 transition duration-300"
      >
        Place Order
      </button>

      {/* Order History Table */}
      <h3 className="text-xl font-semibold text-gray-500 mt-10">Order History</h3>
      <table className="w-full mt-6 border-collapse bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-blue-400">
            <th className="px-4 py-2">Product Name</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Total Price</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">User Name</th>
            <th className="px-4 py-2">User Address</th>
            <th className="px-4 py-2">User Phone</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {orderHistory.length > 0 ? (
            orderHistory.map((order, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">{order.product?.name || "N/A"}</td>
                <td className="px-4 py-2">{order.quantity || "N/A"}</td>
                <td className="px-4 py-2">{order.totalPrice || "N/A"}</td>
                <td className="px-4 py-2">{new Date(order.dateOrdered).toLocaleDateString()}</td>
                <td className="px-4 py-2">{order.userId?.name || "N/A"}</td>
                <td className="px-4 py-2">{order.userId?.address || "N/A"}</td>
                <td className="px-4 py-2">{order.userId?.phone || "N/A"}</td>
                <td className={`px-4 py-2 ${order.status === 'Confirmed' ? 'text-blue-500' : order.status === 'Rejected' ? 'text-red-500' : 'text-gray-500'}`}>
                  {order.status || "Pending"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-4">No orders placed</td>
            </tr>
          )}
        </tbody>
      </table>
            <div className="mt-4 p-4 ml-10 bg-gray-100 w-80 shadow-md rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-500 mb-2">Manage Your Security Question</h3>         <p className="text-gray-600 text-sm mb-3">Update your security question to enhance your account security.</p>
        <Link 
          to={`/security-question/${userId}`} 
          className="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-400 rounded-md shadow-sm hover:bg-blue-300 transition duration-200"
        >
          Security Question Page
        </Link>
      </div>

      <div className="mt-4 ml-10">
        <Link 
          to="/" 
          className="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-400 rounded-md shadow-sm hover:bg-blue-300 transition duration-200"
        >
          Sign Out
        </Link>
      </div>
    </div>
  );
}

export default Userpage;



