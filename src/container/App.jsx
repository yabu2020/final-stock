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
import PaymentSuccess from "../user/PaymentSuccess";
import Home from "../user/Home";
import Signup from "../user/Signup";
import Dashboard from "../admin/Dashboard";
import { UserProvider } from "../admin/UserContext"; // Import UserProvider



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
    <UserProvider>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setCuser={setCuser} />} />
        <Route path="/signup" element={<Signup setCuser={setCuser} />} />
        <Route path="/reset-password" element={<Resetpassword />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* Admin Layout */}
        <Route
          path="/admin/*"
          element={
            cUSer?.role === "Admin" ? (
              <AdminSidebar cUSer={cUSer}>
                <Outlet />
              </AdminSidebar>
            ) : (
              <Navigate to="/no-access" />
            )
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" />} /> {/* Redirect to dashboard */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="adduser" element={<Createuser />} />
          <Route path="users" element={<UsersList />} />
          <Route path="branches" element={<BranchList />} />
          <Route path="addbranch" element={<CreateBranch />} />
          <Route path="resetpassword" element={<Resetpassword />} />
          <Route path="reports" element={<Report />} />
        </Route>

        {/* Manager Layout */}
        <Route
          path="/manager/*"
          element={
            cUSer?.role === "manager" ? (
              <AdminSidebar cUSer={cUSer}>
                <Outlet />
              </AdminSidebar>
            ) : (
              <Navigate to="/no-access" />
            )
          }
        >
          <Route path="productlist" element={<ProductList />} />
          <Route path="registerproduct" element={<RegisterProduct />} />
          <Route path="category" element={<Category />} />
          <Route path="sellproduct" element={<ProductSold />} />
          <Route path="reports" element={<Report />} />
          <Route path="order" element={<Order />} />
        </Route>

        {/* User Layout */}
        <Route
          path="/user/*"
          element={
            cUSer?.role === "user" ? (
              <AdminSidebar cUSer={cUSer}>
                <Outlet />
              </AdminSidebar>
            ) : (
              <Navigate to="/no-access" />
            )
          }
        >
          <Route path="userpage" element={<Userpage />} />
          <Route path="security-question/:userId" element={<Security />} />
        </Route>

        {/* Fallback Route */}
        <Route path="/no-access" element={<NoAccess />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
    </UserProvider>
  );
}

export default App;