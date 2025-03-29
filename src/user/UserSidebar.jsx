import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaShoppingCart, FaLock, FaSignOutAlt,FaBars } from "react-icons/fa";

function UserSidebar({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);
  const location = useLocation();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/"; // Redirect to login page
  };

  const menuItem = [
    {
      path: "#place-order",
      name: "Place Order",
      icon: <FaShoppingCart />,
    },
    {
      path: `/security-question/${localStorage.getItem("userId")}`,
      name: "Manage Security Question",
      icon: <FaLock />,
    },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 bottom-0 bg-gray-900 transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        } text-white flex flex-col shadow-lg border-r border-gray-700 overflow-y-auto`}
      >
        {/* Header */}
        <div className="flex items-center bg-gray-800 p-4">
          <h1
            className={`${isOpen ? "block" : "hidden"} text-xl font-bold ml-2 mb-2 mt-2 text-blue-500`}
          >
            User Panel
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
              `link flex items-center py-2 px-4 hover:bg-blue-600 transition-colors ${
                isActive ? "bg-blue-600" : ""
              }`
            }
          >
            <div className="icon text-xl text-gray-300 mb-4 mr-2">{item.icon}</div>
            <div
              className={`link_text mb-4 ml-2 text-gray-400 text-xl mr-2 ${
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
      <main className={`ml-${isOpen ? "64" : "20"} w-full p-6`}>
        {children}
      </main>
    </div>
  );
}

export default UserSidebar;