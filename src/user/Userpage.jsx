import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";
import UserContext from "../admin/UserContext";
import Select from "react-select";
import { FaClipboardList, FaShoppingCart, FaTimes } from "react-icons/fa";
import Modal from "react-modal";

function Userpage() {
  const { userId } = useParams();
  const { cUSer } = useContext(UserContext);
  const location = useLocation();
  const locationState = location.state;
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState({ text: "", isError: true });
  const [orderHistory, setOrderHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (locationState?.paymentSuccess) {
      setMessage({ text: "Order placed successfully!", isError: false });
      sessionStorage.removeItem("pendingOrder");
      const fetchOrderHistory = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/orders?userId=${cUSer._id}&sort=-createdAt`);
          const uniqueOrders = Array.from(new Map(response.data.map((order) => [order._id, order])).values());
          setOrderHistory(uniqueOrders);
        } catch (error) {
          console.error("Error refreshing orders:", error);
        }
      };
      if (cUSer?._id) fetchOrderHistory();
    } else if (locationState?.paymentError) {
      setMessage({ text: `Payment failed: ${locationState.paymentError}`, isError: true });
      sessionStorage.removeItem("pendingOrder");
    }
  }, [cUSer, locationState]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/branches")
      .then((res) => setBranches(res.data))
      .catch((err) => setMessage({ text: `Error fetching branches: ${err.message}`, isError: true }));
  }, []);

  const fetchProducts = useCallback(
    debounce(() => {
      if (!selectedBranch) return;
      const selectedBranchData = branches.find((b) => b._id === selectedBranch);
      if (!selectedBranchData?.manager?._id) {
        setMessage({ text: "This branch does not have a manager assigned.", isError: true });
        return;
      }
      axios
        .get("http://localhost:3001/productlist", {
          params: { search: searchTerm, branchManagerId: selectedBranchData.manager._id },
        })
        .then((res) => {
          const allProducts = res.data.products.flatMap((cat) =>
            cat.products.map((p) => ({ ...p, categoryName: cat.categoryName }))
          );
          const filtered = allProducts.filter((p) => p.status === "Available" || p.status === "Low Stock");
          setProducts(filtered);
        })
        .catch((err) => setMessage({ text: `Error fetching products: ${err.message}`, isError: true }));
    }, 300),
    [selectedBranch, searchTerm, branches]
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const userId = cUSer?._id;
    if (userId && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      axios
        .get(`http://localhost:3001/orders?userId=${userId}`)
        .then((res) => {
          const uniqueOrders = Array.from(new Map(res.data.map((o) => [o._id, o])).values());
          setOrderHistory(uniqueOrders);
        })
        .catch((err) => setMessage({ text: `Error fetching order history: ${err.message}`, isError: true }));
    }
  }, [cUSer]);

  useEffect(() => {
    if (cUSer !== null) setLoading(false);
  }, [cUSer]);

  const handlePlaceOrder = () => {
    if (isPlacingOrder) return;
    if (!selectedProduct || quantity <= 0) {
      setMessage({ text: "Please select a product and enter a valid quantity.", isError: true });
      return;
    }
    const product = products.find((p) => p._id === selectedProduct);
    if (!product) {
      setMessage({ text: "Selected product not found.", isError: true });
      return;
    }
    if (quantity > product.quantity) {
      setMessage({ text: `Only ${product.quantity} units available.`, isError: true });
      return;
    }
    const selectedBranchData = branches.find((b) => b._id === selectedBranch);
    if (!selectedBranchData?.manager?._id) {
      setMessage({ text: "This branch does not have a manager assigned.", isError: true });
      return;
    }
    const details = {
      productName: product.name,
      quantity,
      unitPrice: product.saleprice,
      totalPrice: product.saleprice * quantity,
      branchName: selectedBranchData.branchName,
      productImage: product.image ? `http://localhost:3001${product.image}` : null,
    };
    setOrderDetails(details);
    setShowOrderConfirmation(true);
  };

  const confirmOrder = () => {
    setIsPlacingOrder(true);
    setShowOrderConfirmation(false);
    const product = products.find((p) => p._id === selectedProduct);
    const selectedBranchData = branches.find((b) => b._id === selectedBranch);
    const tx_ref = `txn-${Date.now()}`;
    const orderData = {
      product: selectedProduct,
      productName: product.name,
      quantity,
      totalPrice: product.saleprice * quantity,
      userId: cUSer._id,
      userEmail: cUSer.email,
      userName: cUSer.name,
      branchManagerId: selectedBranchData.manager._id,
      branchId: selectedBranchData._id,
      branchName: selectedBranchData.branchName,
      tx_ref,
      createdAt: new Date().toISOString(),
      status: "Pending",
    };
    sessionStorage.setItem("pendingOrder", JSON.stringify(orderData));
    const paymentPayload = {
      amount: orderData.totalPrice,
      email: cUSer.email,
      first_name: cUSer.name.split(" ")[0],
      last_name: cUSer.name.split(" ")[1] || "",
      tx_ref,
      metadata: { orderId: orderData._id, userId: orderData.userId, branchId: orderData.branchId },
      return_url: "http://localhost:5173/payment-success",
      callback_url: "http://localhost:5173/payment-success",
    };
    axios
      .post("http://localhost:3001/api/payments/initiate", paymentPayload)
      .then((res) => {
        window.location.href = res.data.checkout_url;
      })
      .catch((err) => {
        sessionStorage.removeItem("pendingOrder");
        setMessage({ text: "Payment initialization failed. Please try again.", isError: true });
        setIsPlacingOrder(false);
      });
  };

  const cancelOrder = () => {
    setShowOrderConfirmation(false);
    setOrderDetails(null);
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#1F2937",
      border: "1px solid #374151",
      borderRadius: "0.5rem",
      padding: "2rem",
      maxWidth: "500px",
      width: "90%",
    },
    overlay: { backgroundColor: "rgba(0, 0, 0, 0.75)", zIndex: 1000 },
  };

  if (loading) return <p>Loading...</p>;
  if (!cUSer) return <p>Unable to load user data.</p>;

  const branchOptions = branches.map((b) => ({
    label: `${b.branchName} - ${b.location}`,
    value: b._id,
  }));

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-md bg-gray-900">
      {/* Order Confirmation Modal */}
      <Modal
        isOpen={showOrderConfirmation}
        onRequestClose={cancelOrder}
        style={customStyles}
        contentLabel="Order Confirmation"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Confirm Your Order</h2>
          <button onClick={cancelOrder} className="text-gray-400 hover:text-white">
            <FaTimes size={20} />
          </button>
        </div>
        {orderDetails && (
          <div className="space-y-4">
            <div className="flex items-start">
              {orderDetails.productImage && (
                <img
                  src={orderDetails.productImage}
                  alt={orderDetails.productName}
                  className="w-20 h-20 object-contain mr-4 rounded"
                  onError={(e) => {
                    e.target.src = "/default-product.png";
                    e.target.className = "w-20 h-20 object-cover mr-4 rounded";
                  }}
                />
              )}
              <div>
                <h3 className="text-lg font-semibold text-white">{orderDetails.productName}</h3>
                <p className="text-gray-300">Branch: {orderDetails.branchName}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-800 p-3 rounded">
                <p className="text-gray-400 text-sm">Quantity</p>
                <p className="text-white font-medium">{orderDetails.quantity}</p>
              </div>
              <div className="bg-gray-800 p-3 rounded">
                <p className="text-gray-400 text-sm">Unit Price</p>
                <p className="text-white font-medium">${orderDetails.unitPrice.toFixed(2)}</p>
              </div>
            </div>
            <div className="bg-blue-900/30 p-3 rounded mt-2">
              <p className="text-gray-400 text-sm">Total Amount</p>
              <p className="text-white font-bold text-xl">${orderDetails.totalPrice.toFixed(2)}</p>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={cancelOrder}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmOrder}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md flex items-center"
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaShoppingCart className="mr-2" />
                    Proceed to Payment
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Message Display */}
      {message.text && (
        <p className={`text-lg mb-4 ${message.isError ? 'text-red-500' : 'text-green-500'}`}>
          {message.text}
        </p>
      )}

      {/* Branch Selector */}
      <div className="mb-6">
        <label className="text-lg text-gray-300 mb-2 block">Select Branch:</label>
        <Select
          value={branchOptions.find((o) => o.value === selectedBranch) || null}
          onChange={(option) => setSelectedBranch(option?.value || "")}
          options={branchOptions}
          placeholder="Select a Branch"
          isSearchable
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "#374151",
              borderColor: "#4B5563",
              color: "white",
            }),
            input: (base) => ({ ...base, color: "white" }),
            menu: (base) => ({ ...base, backgroundColor: "#374151" }),
            singleValue: (base) => ({ ...base, color: "white" }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused ? "#2563EB" : "#374151",
              color: "white",
            }),
          }}
        />
      </div>

      {/* Product Grid */}
      {selectedBranch && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-6">Available Products</h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
                >
                  <div className="relative h-48 bg-gray-700">
                    {product.image ? (
                      <img
                        src={`http://localhost:3001${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-contain p-4"
                        onError={(e) => {
                          e.target.src = "/default-product.png";
                          e.target.className = "w-full h-full object-cover";
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No Image Available
                      </div>
                    )}
                    {product.status === "Low Stock" && (
                      <span className="absolute top-2 right-2 bg-yellow-500 text-xs text-white px-2 py-1 rounded">
                        Low Stock
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">{product.categoryName}</p>
                    <p className="text-blue-400 font-bold">${product.saleprice?.toFixed(2)}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <input
                        type="number"
                        min="1"
                        max={product.quantity}
                        value={selectedProduct === product._id ? quantity : 1}
                        onChange={(e) => {
                          const newQty = Math.min(parseInt(e.target.value, 10) || 1, product.quantity);
                          setQuantity(newQty);
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
            <p className="text-gray-400 text-center py-8">No products available in this branch.</p>
          )}
        </div>
      )}

      {/* Order History Link */}
      <div className="mt-8 text-center">
        <Link
          to="/user/order-history"
          className="inline-flex items-center bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-md text-lg font-medium"
        >
          <FaClipboardList className="mr-2" />
          View Order History
        </Link>
      </div>
    </div>
  );
}

export default Userpage;