import { useState,useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate,Outlet } from "react-router-dom";
import Reset from "../user/Reset";
import Userpage from "../user/Userpage";
import Resetpassword from "../admin/Resetpassword";
import Createuser from '../admin/Createuser';
import UsersList from '../admin/UsersList';
import Login from "../Login";
import AdminSidebar from '../admin/AdminSidebar'; 
import ProductList from '../admin/ProductList'; 
import RegisterProduct from '../admin/RegisterProduct'; 
import Category from '../admin/Category';
import ProductSold from '../admin/ProductSold';
import Report from '../admin/Report';
import Order from '../admin/Order';
import Security from '../user/Security';
import UserContext from '../admin/UserContext';
import BranchSidebar from '../branch/BranchSidebar'; 
import CreateBranch from "../admin/CreateBranch";
import BranchList from "../admin/BranchList";
import NoAccess from "../branch/NoAccess";
import UserSidebar from "../user/UserSidebar";
import Home from "../user/Home";
import Signup from "../user/Signup";


function App() {
  const [cUSer, setCuser] = useState({});
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]); // Add state for branches

  const renderSidebar = () => {
    // Do not render sidebar on the login page ("/")
    if (location.pathname === "/") {
      return null;
    }
  
    // Render sidebar based on user role for other routes
    if (!cUSer || !cUSer.role) {
      return null; // No sidebar for unauthenticated users
    }
    if (cUSer.role === 'Admin') {
      return <AdminSidebar />;
    } else if (cUSer.role === 'manager') {
      return <BranchSidebar />;
    } else if (cUSer.role === 'user') {
      return <UserSidebar />;
    }
    return null;
  };
  useEffect(() => {
    // Check for user data in local storage
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      setCuser(storedUser);
    }
  }, []);
  return (
    <UserContext.Provider value={{ cUSer, setCuser }}>
      <BrowserRouter>
        {renderSidebar()}
        <div className="main-content">
        <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login setCuser={setCuser} />} />
  <Route path="/signup" element={<Signup setCuser={setCuser} />} />
  <Route path="/reset-password" element={<Reset />} />

  {/* Admin Layout */}
  <Route
    path="/admin/*"
    element={
      <AdminSidebar cUSer={cUSer}>
        <Outlet /> {/* Renders child routes inside AdminSidebar */}
      </AdminSidebar>
    }
  >
    <Route path="adduser" element={<Createuser setUsers={setUsers} />} />
    <Route path="users" element={<UsersList users={users} />} />
    <Route path="branches" element={<BranchList branches={branches} />} />
    <Route path="addbranch" element={<CreateBranch setBranches={setBranches} />} />
    <Route path="resetpassword" element={<Resetpassword />} />
    <Route path="reports" element={<Report />} />
  </Route>

  {/* Branch Manager Layout */}
  <Route
    path="/manager/*"
    element={
      <BranchSidebar>
        <Outlet /> {/* Renders child routes inside BranchSidebar */}
      </BranchSidebar>
    }
  >
    <Route path="productlist" element={<ProductList />} />
    <Route path="registerproduct" element={<RegisterProduct />} />
    <Route path="category" element={<Category />} />
    <Route path="sellproduct" element={<ProductSold />} />
    <Route path="reports" element={<Report />} />
    <Route path="order" element={<Order />} />
    <Route path="no-access" element={<NoAccess />} />
  </Route>

  {/* User Layout */}
  <Route
    path="/user/*"
    element={
      <UserSidebar>
        <Outlet /> {/* Renders child routes inside UserSidebar */}
      </UserSidebar>
    }
  >
    <Route path="Userpage" element={<Userpage />} />
    <Route path="security-question/:userId" element={<Security />} />
  </Route>

  {/* Fallback Route */}
  <Route path="*" element={<Navigate to="/" />} />
</Routes>
        </div>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
