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
  FaChartBar,
} from "react-icons/fa";

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
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close sidebar on route change (especially on mobile)
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  // Handle window resize to adjust sidebar state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true); // Auto-open on desktop
      } else {
        setIsOpen(false); // Close on mobile
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login", { replace: true });
  };

  // Determine if we're on mobile
  const isMobile = window.innerWidth < 768;

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 bg-gray-900 border-r border-gray-700 flex flex-col shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMobile
            ? isOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0 w-64"
        } w-64 md:w-64`}
      >
        {/* Header */}
        <div className="flex items-center p-4 bg-gray-800">
          <h2 className={`${isOpen || !isMobile ? "block" : "hidden"} text-xl font-bold text-blue-400 ml-2`}>
            Bakery Admin
          </h2>
          <button
            onClick={toggleSidebar}
            className="ml-auto text-2xl text-gray-300 hover:text-white focus:outline-none md:hidden"
            aria-label="Toggle sidebar"
          >
            <FaBars />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 mt-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center py-3 px-4 text-gray-300 hover:bg-blue-700 hover:text-white transition-colors ${
                  isActive ? "bg-blue-600 text-white border-l-4 border-blue-400" : ""
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`ml-3 font-medium ${isMobile && !isOpen ? "hidden" : "block"}`}>
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`flex items-center py-3 px-4 text-red-400 hover:bg-red-700 hover:text-white transition-colors ${
            isMobile && !isOpen ? "justify-center" : "justify-start"
          }`}
        >
          <FaSignOutAlt className="text-xl" />
          <span className={`ml-3 font-medium ${isMobile && !isOpen ? "hidden" : "block"}`}>
            Logout
          </span>
        </button>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          isMobile ? "p-4" : "ml-0 md:ml-64 p-4"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminSidebar;