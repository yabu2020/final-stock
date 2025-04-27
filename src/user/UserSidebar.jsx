import React, { useState } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { FaBars, FaShoppingCart, FaLock, FaSignOutAlt } from "react-icons/fa";

function UserSidebar({ children }) {
  const { userId } = useParams();
  console.log("User ID from useParams:", userId); // Log the userId

  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);
  const location = useLocation();
  const navigate = useNavigate();

  // Get current user data from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [isAuthenticated, setIsAuthenticated] = useState(!!currentUser);

  // Use currentUser._id as a fallback if userId is undefined
  const currentUserId = userId || currentUser?._id;

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setIsAuthenticated(false);
    navigate("/"); // Redirect to login
    window.location.reload(); // Refresh to clear state
  };

  // Define menu items for the user
  const menuItem = [
    {
      path: "/user/Userpage",
      name: "Place Order",
      icon: <FaShoppingCart />,
    },
    {
      path: `/user/security-question/${currentUserId}`,
      name: "Manage Security Question",
      icon: <FaLock />,
    },
  ];

  return (
    <>
      {isAuthenticated && location.pathname !== "/" && (
         <div
         style={{
             display: 'flex',
             overflow: 'hidden', /* Prevent body from scrolling */
         }}
     >
          {/* Sidebar */}
          <div
            className={`fixed top-0 left-0 bottom-0 bg-gray-900 transition-all duration-300 ${
              isOpen ? "w-64" : "w-20"
            } text-white flex flex-col shadow-lg border-r border-gray-700 overflow-y-auto`}
          >
            <div className="flex items-center bg-gray-800 p-4">
              {/* Display Welcome Message with User's Name */}
              <h1
                className={`${isOpen ? "block" : "hidden"} text-xl font-bold ml-2 mb-2 mt-2 text-blue-500`}
              >
                Welcome, {currentUser?.name || "User"}
              </h1>
              <div
                className="ml-auto text-2xl cursor-pointer mb-4 mt-2 pr-4 hover:bg-blue-400 rounded-full p-1 transition-colors duration-200"
                onClick={toggle}
              >
                <FaBars />
              </div>
            </div>

            {/* Menu Items */}
            {menuItem.map((item, index) => (
              <NavLink
                to={item.path}
                key={index}
                className={({ isActive }) =>
                  `link flex items-center py-2 px-4 ${
                    isActive ? "bg-blue-600" : "hover:bg-gray-700"
                  } transition-colors`
                }
              >
                <div className="icon text-xl text-gray-300 mr-2">{item.icon}</div>
                <div
                  className={`link_text text-gray-400 text-xl ${
                    isOpen ? "block" : "hidden"
                  }`}
                >
                  {item.name}
                </div>
              </NavLink>
            ))}

            {/* Logout Button at the Bottom */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center text-red-500 py-2 px-4 mt-auto mb-4 hover:bg-red-600 w-full transition-colors"
            >
              <FaSignOutAlt className="mr-2 text-xl" />
              <span className={`${isOpen ? "block" : "hidden"}`}>Logout</span>
            </button>
          </div>

          {/* Main Content */}
          <main  style={{
                            flex: 1,
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            marginLeft: isOpen ? '16rem' : '5rem',
                            backgroundColor: '#1f2937',
                            padding: '1rem',
                            minHeight: '0vh',
                            transition: 'margin-left 300ms ease',
                        }}>
            <div className="p-6 bg-gray-800 rounded-lg shadow-md text-white">
              {children}
            </div>
          </main>
        </div>
      )}
    </>
  );
}

export default UserSidebar;