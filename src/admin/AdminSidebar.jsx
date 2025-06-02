import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaUserPlus, FaUsers, FaBuilding, FaProjectDiagram, FaChartBar, FaSignOutAlt, FaLock, FaShoppingBasket, FaUsersCog, FaTag, FaShoppingCart, FaHome, FaPlusSquare, FaBox, FaClipboardList, FaCog, FaQuestionCircle, FaUserEdit } from "react-icons/fa";

const getAdminMenu = (cUSer) => [
  { path: "/admin/admin-dashboard", name: "Dashboard", icon: <FaHome /> },
  { path: "/admin/employees", name: "Employee", icon: <FaUsersCog /> },
  { path: "/admin/adduser", name: "Create User", icon: <FaUserPlus /> },
  { path: "/admin/users", name: "User List", icon: <FaUsers /> },
  { path: "/admin/addbranch", name: "Add Branch", icon: <FaProjectDiagram /> },
  { path: "/admin/branches", name: "Branch List", icon: <FaBuilding /> },
  { path: "/admin/reports", name: "Report", icon: <FaChartBar /> },
  { path: "/admin/resetpassword", name: "Reset Password", icon: <FaLock /> },
  { 
    name: "Settings", 
    icon: <FaCog />,
    submenu: [
      { path: `/admin/security-question/${cUSer?._id}`, name: "Security Question", icon: <FaLock /> },
      { path: `/admin/edit-profile/${cUSer?._id}`, name: "Edit Profile", icon: <FaUserEdit /> },
      { path: `/admin/help/${cUSer?._id}`, name: "Help", icon: <FaQuestionCircle /> }
    ]
  }
];

const getManagerMenu = (cUSer) => [  
  { path: "/manager/manager-dasboard", name: "Dashboard", icon: <FaHome /> },
  { path: "/manager/buyproduct", name: "Buy Product", icon: <FaShoppingBasket /> },
  { path: "/manager/addproduct", name: "Add Product", icon: <FaPlusSquare/> },
  { path: "/manager/productlist", name: "List Of Product", icon: <FaBox /> },
  { path: "/manager/category", name: "Category", icon: <FaTag /> },
  { path: "/manager/sellproduct", name: "Sell Product", icon: <FaShoppingCart /> },
  { path: "/manager/orders", name: "Orders", icon: <FaClipboardList /> },
  { path: "/manager/reports", name: "Report", icon: <FaChartBar /> },
  { 
    name: "Settings", 
    icon: <FaCog />,
    submenu: [
      { path: `/manager/security-question/${cUSer?._id}`, name: "Security Question", icon: <FaLock /> },
      { path: `/manager/edit-profile/${cUSer?._id}`, name: "Edit Profile", icon: <FaUserEdit /> },
      { path: `/manager/help/${cUSer?._id}`, name: "Help", icon: <FaQuestionCircle /> }
    ]
  }
];

const getUserMenu = (cUSer) => [
  { path: "/user/customer-dashboard", name: "Dashboard", icon: <FaHome /> },
  { path: "/user/Userpage", name: "Place Order", icon: <FaShoppingCart /> },
  { path: "/user/order-history", name: "Order History", icon: <FaClipboardList /> },
  { 
    name: "Settings", 
    icon: <FaCog />,
    submenu: [
      { path: `/user/security-question/${cUSer?._id}`, name: "Security Question", icon: <FaLock /> },
      { path: `/user/edit-profile/${cUSer?._id}`, name: "Edit Profile", icon: <FaUserEdit /> },
      { path: `/user/help/${cUSer?._id}`, name: "Help", icon: <FaQuestionCircle /> }
    ]
  }
];

const SubMenu = ({ item, isOpen }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const location = useLocation();

  const toggleSubMenu = () => setIsSubMenuOpen(!isSubMenuOpen);

  return (
    <div>
      <div
        onClick={toggleSubMenu}
        className={`link flex items-center py-2 px-4 rounded transition-colors cursor-pointer ${
          location.pathname.includes(item.path) || 
          item.submenu.some(subItem => location.pathname === subItem.path)
            ? "bg-blue-700 text-white"
            : "hover:bg-blue-600 text-gray-400"
        }`}
        style={{ justifyContent: isOpen ? "flex-start" : "center" }}
      >
        <span className="text-xl mr-2 inline-block" style={{ fontSize: "1.5rem" }}>
          {item.icon}
        </span>
        <span className={`text-xl ${isOpen ? "block" : "hidden"}`}>
          {item.name}
        </span>
        {isOpen && (
          <span className="ml-auto transition-transform duration-200">
            {isSubMenuOpen ? "▼" : "▶"}
          </span>
        )}
      </div>
      
      {isSubMenuOpen && isOpen && (
        <div className="bg-gray-800 ml-6 rounded">
          {item.submenu.map((subItem, subIndex) => (
            <NavLink
              to={subItem.path}
              key={subIndex}
              className={({ isActive }) =>
                `block py-2 px-6 rounded transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "hover:bg-blue-500 text-gray-400"
                }`
              }
            >
              <div className="flex items-center">
                <span className="text-lg mr-2">{subItem.icon}</span>
                <span>{subItem.name}</span>
              </div>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

function AdminSidebar({ children, cUSer }) {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setIsAuthenticated(false);
    navigate("/");
    window.location.reload();
  };

  const getMenuItems = () => {
    switch (cUSer?.role) {
      case "Admin": return getAdminMenu(cUSer);
      case "manager": return getManagerMenu(cUSer);
      case "user": return getUserMenu(cUSer);
      default: return [];
    }
  };
  const menuItem = getMenuItems();

  return (
    <>
      {isAuthenticated && location.pathname !== "/" && (
        <div style={{ display: "flex", overflow: "hidden" }}>
          <div
            className={`fixed top-0 left-0 bottom-0 bg-gray-900 transition-all duration-300 ${isOpen ? "w-64" : "w-20"} text-white flex flex-col shadow-lg border-r border-gray-700 overflow-y-auto`}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              width: isOpen ? "16rem" : "5rem",
              backgroundColor: "#1c1c2e",
              transition: "all 300ms ease",
              zIndex: 1000,
            }}
          >
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

            {menuItem.map((item, index) => (
              <div key={index}>
                {item.submenu ? (
                  <SubMenu item={item} isOpen={isOpen} />
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `link flex items-center py-2 px-4 rounded transition-colors ${
                        isActive ? "bg-blue-700 text-white" : "hover:bg-blue-600 text-gray-400"
                      }`
                    }
                    style={{ justifyContent: isOpen ? "flex-start" : "center" }}
                  >
                    <span className="text-xl mr-2 inline-block" style={{ fontSize: "1.5rem" }}>
                      {item.icon}
                    </span>
                    <span className={`text-xl ${isOpen ? "block" : "hidden"}`}>
                      {item.name}
                    </span>
                  </NavLink>
                )}
              </div>
            ))}

            <button
              onClick={handleLogout}
              className="flex items-center justify-center text-red-500 py-2 px-4 mt-auto mb-4 hover:bg-red-600 w-full transition-colors logout-button"
              style={{ justifyContent: isOpen ? "flex-start" : "center" }}
            >
              <FaSignOutAlt className="mr-2 text-xl" />
              <span className={`${isOpen ? "block" : "hidden"}`}>Logout</span>
            </button>
          </div>

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
            <div className="flex justify-center" style={{ width: "100%" }}>
              <div className="max-w-[900px] w-full" style={{ maxWidth: "900px", width: "100%", margin: "0 auto" }}>
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