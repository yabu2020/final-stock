// src/admin/AdminSidebar.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  FaBars,
  FaShoppingBasket,
  FaBox,
  FaFire,
  FaShoppingCart,
  FaMoneyBillWave,
  FaSignOutAlt,
  FaChartBar,} from "react-icons/fa";


// Menu items matching your App.js routes
const menuItems = [
  {
    path: "/addproduct",
    name: "Flour Purchase",
    icon: <FaShoppingBasket />,
  },
  {
    path: "/productlist",
    name: "Bread List",
    icon: <FaBox />,
  },
  {
    path: "/baking",
    name: "Baking",
    icon: <FaFire />,
  },
  {
    path: "/sellproduct",
    name: "Sales",
    icon: <FaShoppingCart />,
  },
  {
    path: "/expense",
    name: "Expense",
    icon: <FaMoneyBillWave />,
  },
  {
    path: "/report",
    name: "Report",
    icon: <FaChartBar />,
  },
];

function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Auto-close sidebar on mobile route change
  useEffect(() => {
    if (window.innerWidth < 768) setIsOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ display: "flex", overflow: "hidden" }}>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 bottom-0 bg-gray-900 text-white flex flex-col shadow-lg border-r border-gray-700 z-50 transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Header */}
        <div className="flex items-center p-4 bg-gray-800">
          <h2 className={`${isOpen ? "block" : "hidden"} text-xl font-bold text-blue-400 ml-2`}>
            Bakery Admin
          </h2>
          <button
            onClick={toggleSidebar}
            className="ml-auto text-2xl text-gray-300 hover:text-white focus:outline-none"
          >
            <FaBars />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 mt-2">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center py-3 px-4 text-gray-300 hover:bg-blue-700 hover:text-white transition-colors ${
                  isActive ? "bg-blue-600 text-white border-l-4 border-blue-400" : ""
                }`
              }
              style={{ justifyContent: isOpen ? "flex-start" : "center" }}
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`ml-3 ${isOpen ? "block" : "hidden"} font-medium`}>
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`flex items-center py-3 px-4 text-red-400 hover:bg-red-700 hover:text-white transition-colors ${
            isOpen ? "justify-start" : "justify-center"
          }`}
        >
          <FaSignOutAlt className="text-xl" />
          <span className={`ml-3 ${isOpen ? "block" : "hidden"} font-medium`}>
            Logout
          </span>
        </button>
      </div>

      {/* Main Content — Outlet renders /addproduct, /baking, etc. */}
      <main
        className="flex-1"
        style={{
          marginLeft: isOpen ? "16rem" : "5rem",
          backgroundColor: "#1f2937",
          padding: "1rem",
          minHeight: "100vh",
          transition: "margin-left 0.3s ease",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <Outlet /> {/* ✅ This is the key: renders nested route elements */}
        </div>
      </main>
    </div>
  );
}

export default AdminSidebar;