import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBars, FaBox, FaPlusSquare, FaTags, FaShoppingCart, FaChartBar, FaClipboardList, FaSignOutAlt } from "react-icons/fa";

function BranchSidebar({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const [branchName, setBranchName] = useState(null); // State for branch name
  const [loading, setLoading] = useState(true); // Loading state to handle initial fetch
  const toggle = () => setIsOpen(!isOpen);
  const location = useLocation();
  const navigate = useNavigate();

  // Get current user data from localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!currentUser);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setIsAuthenticated(false);
    navigate("/"); // Redirect to login
    window.location.reload(); // Refresh to clear state
  };

  // Fetch branch details
  useEffect(() => {
    const fetchBranchDetails = async () => {
      if (currentUser?._id) {
        try {
          const response = await axios.get(`http://localhost:3001/branch-by-manager/${currentUser._id}`);
          setBranchName(response.data.branchName); // Set branch name
        } catch (error) {
          console.error("Error fetching branch details:", error);
          setBranchName(null); // Clear branch name if no branch is assigned
        } finally {
          setLoading(false); // Mark loading as complete
        }
      }
    };

    fetchBranchDetails();
  }, [currentUser?._id]);

  // Define menu items
  const menuItem = [
    {
      path: "/registerproduct",
      name: "Register Product",
      icon: <FaPlusSquare />,
    },
    {
      path: "/productlist",
      name: "List Of Product",
      icon: <FaBox />,
    },
    {
      path: "/category",
      name: "Category",
      icon: <FaTags />,
    },
    {
      path: "/sellproduct",
      name: "Sell Product",
      icon: <FaShoppingCart />,
    },
    {
      path: "/order",
      name: "Orders",
      icon: <FaClipboardList />,
    },
    {
      path: "/reports",
      name: "Report",
      icon: <FaChartBar />,
    },
  ];

  // If the user is not authenticated, don't render anything
  if (!isAuthenticated) return null;

  // If the user is not a manager, don't render the sidebar
  if (currentUser.role !== "manager") return null;

  return (
    <>
      <div style={{ display: location.pathname === "/reset-password" ? "none" : "flex" }} className="flex">
        {/* Sidebar */}
        <div className={`fixed top-0 left-0 bottom-0 bg-blueblack transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} text-white flex flex-col shadow-lg border-r border-gray-700 overflow-y-auto`}
          style={{ backgroundColor: '#1c1c2e' }}>
          
          {loading ? (
            // Show a loading spinner while fetching branch details
            <div className="flex items-center justify-center h-full">
              <div className="text-blue-500 font-bold">Loading...</div>
            </div>
          ) : (
            <>
              <div className="flex items-center bg-gray-80 p-4">
                {/* Display Branch Name or Default Message */}
                <h1 className={`${isOpen ? 'block' : 'hidden'} text-xl font-bold ml-2 mb-2 mt-2 text-blue-500`}>
                  {branchName
                    ? `Branch Manager - ${branchName}`
                    : "Branch Manager - No branch assigned yet"}
                </h1>
                <div className="ml-auto text-2xl cursor-pointer mb-4 mt-2 pr-4 hover:bg-blue-400 rounded-full p-1 transition-colors duration-200" onClick={toggle}>
                  <FaBars />
                </div>
              </div>

              {/* Message for Unassigned Managers */}
              {!branchName && (
                <div className="text-red-500 font-bold text-center mt-4">
                  You are not assigned to any branch. Please contact the admin.
                </div>
              )}

              {/* Menu Items */}
              {branchName && menuItem.map((item, index) => (
                <NavLink 
                  to={item.path} 
                  key={index} 
                  className="link flex items-center py-2 px-4 hover:bg-blue-600 transition-colors"
                  style={{ transition: 'background-color 0.3s' }}
                >
                  <div className="icon text-xl text-gray-300 mb-4 mr-2">{item.icon}</div>
                  <div className={`link_text mb-4 ml-2 text-gray-400 text-xl mr-2 ${isOpen ? 'block' : 'hidden'}`}>{item.name}</div>
                </NavLink>
              ))}

              {/* Logout Button at the Bottom */}
              <button 
                onClick={handleLogout} 
                className="flex items-center justify-center text-red-500 py-2 px-4 mt-auto mb-4 hover:bg-red-600 w-full transition-colors"
              >
                <FaSignOutAlt className="mr-2 text-xl" />
                <span className={`${isOpen ? 'block' : 'hidden'}`}>Logout</span>
              </button>
            </>
          )}
        </div>

        {/* Main content */}
        <main className="ml-20 w-full p-6">
          {children}
        </main>
      </div>
    </>
  );
}

export default BranchSidebar;