import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaUserPlus, FaUsers, FaBuilding, FaProjectDiagram, FaChartBar, FaSignOutAlt, FaLock, FaShoppingBasket, FaPlus, FaTag, FaShoppingCart, FaUser, FaPlusSquare, FaBox, FaClipboardList } from "react-icons/fa";

// Helper functions to define role-based menu items
const getAdminMenu = () => [
  {
    path: "/admin/dashboard",
    name: "Dashboard",
    icon: <FaBars />,
  },
  {
    path: "/admin/adduser",
    name: "Create User",
    icon: <FaUserPlus />,
  },
  {
    path: "/admin/users",
    name: "User List",
    icon: <FaUsers />,
  },
  {
    path: "/admin/branches",
    name: "Branch List",
    icon: <FaBuilding />,
  },
  {
    path: "/admin/addbranch",
    name: "Add Branch",
    icon: <FaProjectDiagram />,
  },
  {
    path: "/admin/reports",
    name: "Report",
    icon: <FaChartBar />,
  },
  {
    path: "/admin/resetpassword",
    name: "Reset Password",
    icon: <FaLock />,
  },
];

const getManagerMenu = () => [
  {
    path: "/manager/addproduct",
    name: "Add Product",
    icon: <FaPlusSquare />,
  },
  {
    path: "/manager/buyproduct",
    name: "Buy Product",
    icon: <FaShoppingBasket />,
  },
  {
    path: "/manager/productlist",
    name: "List Of Product",
    icon: <FaBox />,
  },
  {
    path: "/manager/category",
    name: "Category",
    icon: <FaTag />,
  },
  {
    path: "/manager/sellproduct",
    name: "Sell Product",
    icon: <FaShoppingCart />,
  },
  {
    path: "/manager/orders",
    name: "Orders",
    icon: <FaClipboardList />,
  },
  {
    path: "/manager/reports",
    name: "Report",
    icon: <FaChartBar />,
  },
];

const getUserMenu = (cUSer) => [
  {
    path: "/user/Userpage",
    name: "Place Order",
    icon: <FaShoppingCart />,
  },
  {
    path: `/user/security-question/${cUSer?._id}`, // Dynamically include userId
    name: "Manage Security Question",
    icon: <FaLock />,
  },
];

function AdminSidebar({ children, cUSer }) {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setIsAuthenticated(false);
    navigate("/"); // Redirect to login
    window.location.reload(); // Refresh to clear state
  };

  // Get menu items based on user role
  const getMenuItems = () => {
    switch (cUSer?.role) {
      case "Admin":
        return getAdminMenu();
      case "manager":
        return getManagerMenu();
      case "user":
        return getUserMenu(cUSer); // Pass cUSer to getUserMenu
      default:
        return [];
    }
  };

  const menuItem = getMenuItems();

  return (
    <>
      {isAuthenticated && location.pathname !== "/" && (
        <div
          style={{
            display: "flex",
            overflow: "hidden", /* Prevent body from scrolling */
          }}
        >
          {/* Sidebar */}
          <div
            className={`fixed top-0 left-0 bottom-0 bg-gray-900 transition-all duration-300 ${isOpen ? "w-64" : "w-20"} text-white flex flex-col shadow-lg border-r border-gray-700 overflow-y-auto`}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              width: isOpen ? "16rem" : "5rem",
              backgroundColor: "#1c1c2e", // Sidebar background color
              color: "white",
              transition: "all 300ms ease",
              zIndex: 1000, /* Ensure it appears above other elements */
            }}
          >
            {/* Sidebar Header */}
            <div className="flex items-center bg-gray-800 p-4">
              <h1 className={`${isOpen ? "block" : "hidden"} text-xl font-bold ml-2 mb-2 mt-2 text-blue-500`}>
                {cUSer?.role || "Guest"}
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
                  `link flex items-center py-2 px-4 rounded transition-colors ${
                    isActive ? "bg-blue-700 text-white" : "hover:bg-blue-600 text-gray-400"
                  }`
                }
                style={{
                  justifyContent: isOpen ? "flex-start" : "center", // Center icons when collapsed
                }}
              >
                {item.icon} {/* Always show the icon */}
                <span className={`text-xl mr-2 ${isOpen ? "block" : "hidden"}`}>
                  {item.name}
                </span>
              </NavLink>
            ))}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center text-red-500 py-2 px-4 mt-auto mb-4 hover:bg-red-600 w-full transition-colors logout-button"
              style={{
                justifyContent: isOpen ? "flex-start" : "center", // Center icon when collapsed
              }}
            >
              <FaSignOutAlt className="mr-2 text-xl" />
              <span className={`${isOpen ? "block" : "hidden"}`}>Logout</span>
            </button>
          </div>

          {/* Main Content */}
          <main
            style={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              marginLeft: isOpen ? "16rem" : "5rem",
              backgroundColor: "#1f2937",
              padding: "1rem",
              minHeight: "100vh",
              transition: "margin-left 300ms ease",
            }}
          >
            {/* Wrap Children in a Centering Container */}
            <div
              className="flex justify-center"
              style={{ width: "100%" }} // Ensure the container spans the full width
            >
              <div
                className="max-w-[900px] w-full"
                style={{
                  maxWidth: "900px", // Constrain the maximum width
                  width: "100%", // Ensure it takes full width within constraints
                  margin: "0 auto", // Explicitly center using margin
                }}
              >
                {/* Render the routed component */}
                {children}
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
}

export default AdminSidebar;