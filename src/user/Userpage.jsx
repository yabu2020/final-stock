
import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from "axios";
import debounce from 'lodash.debounce';
import UserContext from '../admin/UserContext';
import Select from "react-select";
import { FaClipboardList, FaShoppingCart } from "react-icons/fa";
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
    control: (provided) => ({
      ...provided,
      backgroundColor: "#374151", // Tailwind bg-gray-700
      borderColor: "#4B5563", // Tailwind border-gray-600
      color: "white",
    }),
    input: (provided) => ({
      ...provided,
      color: "white",
      opacity: 1,
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#374151",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#2563EB" : "#374151",
      color: "white",
      cursor: "pointer",
    }),
  }}
/>
        </div>
      </div>
  
      {/* Products Grid */}
      {selectedBranch && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-6">Available Products</h2>
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <div 
                  key={product._id} 
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
                >
                  {/* Product Image - Updated with proper URL handling */}
                  <div className="relative h-48 bg-gray-700 overflow-hidden">
                    {product.image ? (
                      <img 
                        src={`http://localhost:3001${product.image}`} // Adjust this path based on your server setup
                        alt={product.name}
                        className="w-full h-full object-contain p-4"
                        onError={(e) => {
                          e.target.src = '/default-product.png';
                          e.target.className = "w-full h-full object-cover";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span>No Image Available</span>
                      </div>
                    )}
                    {product.status === 'Low Stock' && (
                      <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                        Low Stock
                      </span>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">{product.categoryName}</p>
                    <p className="text-blue-400 font-bold">${product.saleprice?.toFixed(2)}</p>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <input
                        type="number"
                        min="1"
                        max={product.quantity}
                        value={selectedProduct === product._id ? quantity : 1}
                        onChange={(e) => {
                          const newQuantity = Math.min(
                            parseInt(e.target.value, 10) || 1,
                            product.quantity
                          );
                          setQuantity(newQuantity);
                          setSelectedProduct(product._id);
                        }}
                        className="w-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                      />
                      
                      <button
                        onClick={() => {
                          setSelectedProduct(product._id);
                          handlePlaceOrder();
                        }}
                        disabled={isPlacingOrder && selectedProduct === product._id}
                        className={`px-4 py-2 rounded-md flex items-center ${
                          isPlacingOrder && selectedProduct === product._id 
                            ? "bg-gray-600 cursor-not-allowed" 
                            : "bg-blue-600 hover:bg-blue-500"
                        } text-white`}
                      >
                        <FaShoppingCart className="mr-2" />
                        {isPlacingOrder && selectedProduct === product._id ? "Processing..." : "Order"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">
              {selectedBranch ? "No products available in this branch" : "Please select a branch to view products"}
            </p>
          )}
        </div>
      )}

      {/* Order History Link */}
      <div className="mt-8 text-center">
        <Link 
          to="/user/order-history" 
          className="inline-flex items-center bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-md text-lg font-medium transition duration-300"
        >
          <FaClipboardList className="mr-2" />
          View Order History
        </Link>
      </div>
    </div>
  );
}

export default Userpage;


