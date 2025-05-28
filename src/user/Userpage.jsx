
import React, { useState, useEffect, useCallback, useContext ,useRef} from "react";
import { useParams, Link,useLocation } from 'react-router-dom';
import axios from "axios";
import debounce from 'lodash.debounce';
import UserContext from '../admin/UserContext'; // Adjust import path as needed
import Select from "react-select";

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
  const [isPlacingOrder, setIsPlacingOrder] = useState(false); // Add at the top
  const hasFetchedRef = useRef(false);

  const location = useLocation();
const locationState = location.state;

useEffect(() => {
  if (locationState?.paymentSuccess) {
    setMessage("Order placed successfully!");
    
    // Clear any pending order from storage
    sessionStorage.removeItem('pendingOrder');
    
    if (cUSer?._id) {
      // Use a dedicated function to prevent duplicate fetches
      const fetchOrderHistory = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/orders?userId=${cUSer._id}&sort=-createdAt`);
          
          // More robust deduplication
          const orderMap = new Map();
          response.data.forEach(order => {
            if (!orderMap.has(order._id)) {
              orderMap.set(order._id, order);
            }
          });
          
          setOrderHistory(Array.from(orderMap.values()));
        } catch (error) {
          console.error("Error refreshing orders:", error);
        }
      };
      
      fetchOrderHistory();
    }
  } else if (locationState?.paymentError) {
    setMessage(`Payment failed: ${locationState.paymentError}`);
    sessionStorage.removeItem('pendingOrder');
  }
}, [cUSer, locationState]);

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
 // Update your fetchProducts function to log more details
const fetchProducts = useCallback(debounce(() => {
  if (!selectedBranch) {
    console.log("No branch selected - skipping product fetch");
    return;
  }
  
  console.log("Selected branch ID:", selectedBranch);
  const selectedBranchData = branches.find(branch => branch._id === selectedBranch);
  console.log("Selected branch data:", selectedBranchData);

  if (!selectedBranchData || !selectedBranchData.manager?._id) {
    console.warn("No manager assigned to branch:", selectedBranch);
    setMessage("This branch does not have a manager assigned.");
    return;
  }

  const branchManagerId = selectedBranchData.manager._id;
  console.log("Fetching products for manager:", branchManagerId);

  axios.get("http://localhost:3001/productlist", { 
    params: { 
      search: searchTerm,
      branchManagerId: branchManagerId
    } 
  })
  .then((response) => {
    console.log('Full API response:', response);
    console.log('Products data structure:', response.data);
    
    const allProducts = response.data.products.flatMap(category => {
      console.log('Processing category:', category);
      return category.products.map(product => ({
        ...product,
        categoryName: category.categoryName
      }));
    });

    console.log('All products before filtering:', allProducts);
    
    const filteredProducts = allProducts.filter(product =>
      product.status === 'Available' || product.status === 'Low Stock'
    );

    console.log('Filtered products:', filteredProducts);
    setProducts(filteredProducts);
  })
  .catch((error) => {
    console.error("Error fetching products:", error);
    setMessage(`Error fetching products: ${error.message}`);
  });
}, 300), [selectedBranch, searchTerm, branches]);
useEffect(() => {
  fetchProducts();
}, [fetchProducts]);


  // Fetch products when branch or search term changes
  useEffect(() => {
    const userId = cUSer?._id;
    if (userId && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      axios
        .get(`http://localhost:3001/orders?userId=${userId}`)
        .then((response) => {
          const uniqueOrders = Array.from(new Map(response.data.map(order => [order._id, order])).values());
          setOrderHistory(uniqueOrders);
        })
        .catch((error) => setMessage(`Error fetching order history: ${error.message}`));
    }
  }, [cUSer]);

  // Handle loading state
  useEffect(() => {
    if (cUSer !== null) {
      setLoading(false); // Set loading to false once user data is fetched
    }
  }, [cUSer]);

  const handlePlaceOrder = () => {
    if (isPlacingOrder) return;
    setIsPlacingOrder(true);
  
    if (!selectedProduct || quantity <= 0) {
      setMessage("Please select a product and enter a valid quantity.");
      setIsPlacingOrder(false);
      return;
    }
  
    const product = products.find(p => p._id === selectedProduct);
    if (!product) {
      setMessage("Selected product not found.");
      setIsPlacingOrder(false);
      return;
    }
  
    if (quantity > product.quantity) {
      setMessage(`Only ${product.quantity} units available.`);
      setIsPlacingOrder(false);
      return;
    }
  
    const totalPrice = product.saleprice * quantity;
    const selectedBranchData = branches.find(branch => branch._id === selectedBranch);
    if (!selectedBranchData || !selectedBranchData.manager?._id) {
      setMessage("This branch does not have a manager assigned.");
      setIsPlacingOrder(false);
      return;
    }
  
    const tx_ref = `txn-${Date.now()}`;
    const orderData = {
      product: selectedProduct,
      productName: product.name,
      quantity,
      totalPrice,
      userId: cUSer._id,
      userEmail: cUSer.email,
      userName: cUSer.name,
      branchManagerId: selectedBranchData.manager._id,
      branchId: selectedBranchData._id,
      branchName: selectedBranchData.branchName,
      tx_ref,
      createdAt: new Date().toISOString(),
      status: 'Pending',
    };
  
    // Store the pending order in both localStorage and sessionStorage
    // Store in both storage mechanisms
    sessionStorage.setItem('pendingOrder', JSON.stringify(orderData));


  
    const paymentPayload = {
      amount: totalPrice,
      email: cUSer.email,
      first_name: cUSer.name.split(" ")[0],
      last_name: cUSer.name.split(" ")[1] || "",
      tx_ref,
      metadata: { // Add metadata to payment
        orderId: orderData._id,
        userId: orderData.userId,
        branchId: orderData.branchId},
        return_url: "http://localhost:5173/payment-success",
      callback_url: "http://localhost:5173/payment-success",
    };
  
    axios
      .post("http://localhost:3001/api/payments/initiate", paymentPayload)
      .then((response) => {
        window.location.href = response.data.checkout_url;
      })
      .catch((err) => {
        localStorage.removeItem('pendingOrder');
        sessionStorage.removeItem('pendingOrder');
        setMessage("Payment initialization failed. Please try again.");
        setIsPlacingOrder(false);
      });
  };
  if (loading) {
    return <p>Loading...</p>; // Show loading message while user data is being fetched
  }

  if (!cUSer) {
    return <p>Unable to load user data. Please try again later.</p>; // Show error if user data is still missing
  }
  

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-md bg-gray-900">
    <h2 className="text-3xl font-bold text-blue-400 mb-6">Welcome!</h2>
    {message && <p className="text-red-500 text-lg mb-4">{message}</p>}
  
    {/* Branch Selection */}
    <div className="mb-6">
        <div className="flex items-center space-x-4">
          <label htmlFor="branch-select" className="block text-lg font-medium text-gray-300 mb-2">
            Select Branch:
          </label>
          <Select
  id="branch-select"
  value={branches.find(branch => branch._id === selectedBranch) || null}
  onChange={(selectedOption) => setSelectedBranch(selectedOption?._id || "")}
  options={branches.map(branch => ({
    label: `${branch.branchName} - ${branch.location}`,
    value: branch._id,
    _id: branch._id
  }))}
  placeholder="Select a Branch"
  className="w-full sm:w-64 text-white"
  isSearchable
  styles={{
    control: (base) => ({
      ...base,
      backgroundColor: "#1f2937",
      borderColor: "#4b5563",
      color: "#fff",
      minHeight: "40px", // Ensure sufficient height
    }),
    input: (base) => ({
      ...base,
      color: "#fff",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#fff",
      fontSize: "14px", // Ensure readable font size
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#1f2937",
      color: "#fff",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#3b82f6" : "#1f2937",
      color: "#fff",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9ca3af", // Light gray placeholder text
    }),
  }}
/>
        </div>
      </div>
  
   {/* Product Selection */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <label htmlFor="product-select" className="block text-lg font-medium text-gray-300 mb-2">
            Select Product:
          </label>
          <Select
            id="product-select"
            value={products.find(product => product._id === selectedProduct) || null}
            onChange={(selectedOption) => setSelectedProduct(selectedOption?._id || "")}
            options={products.map(product => ({
              label: `${product.name} - $${product.saleprice}`,
              value: product._id,
              _id: product._id
            }))}
            placeholder="Select a Product"
            className="w-full sm:w-64 text-white"
            isSearchable
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
                borderColor: "#4b5563",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#3b82f6" : "#1f2937",
                color: "#fff",
                ':active': {
                  backgroundColor: "#3b82f6",
                },
              }),
              placeholder: (base) => ({
                ...base,
                color: "#9ca3af",
              }),
            }}
          />
        </div>
      </div>
  
    {/* Quantity Input */}
    <div className="mb-6">
      <div className="flex items-center space-x-4">
        <label htmlFor="quantity" className="block text-lg font-medium text-gray-300 mb-2">
          Quantity:
        </label>
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
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter quantity"
        />
      </div>
    </div>
  
    {/* Place Order Button */}
    <button
  onClick={handlePlaceOrder}
  disabled={isPlacingOrder}
  className={`px-6 py-3 ${
    isPlacingOrder ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
  } text-white font-semibold rounded-md shadow-md transition duration-300`}
>
  {isPlacingOrder ? "Processing..." : "Place Order"}
</button>

  
    {/* Order History Table */}
    <h3 className="text-xl font-semibold text-blue-400 mt-10">Order History</h3>
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full table-auto border-collapse bg-gray-800 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-700 text-gray-300">
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
              <tr key={index} className="border-b border-gray-600">
                <td className="px-4 py-2 text-gray-300">{order.product?.name || "N/A"}</td>
                <td className="px-4 py-2 text-gray-300">{order.quantity || "N/A"}</td>
                <td className="px-4 py-2 text-gray-300">{order.totalPrice || "N/A"}</td>
                <td className="px-4 py-2 text-gray-300">
                  {new Date(order.dateOrdered).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-gray-300">{order.userId?.name || "N/A"}</td>
                <td className="px-4 py-2 text-gray-300">{order.userId?.address || "N/A"}</td>
                <td className="px-4 py-2 text-gray-300">{order.userId?.phone || "N/A"}</td>
                <td className={`px-4 py-2 text-gray-300 ${order.status === 'Confirmed' ? 'text-blue-500' : order.status === 'Rejected' ? 'text-red-500' : 'text-gray-500'}`}>
                  {order.status || "Pending"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-4 text-gray-400">
                No orders placed
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
  
  );
}

export default Userpage;


