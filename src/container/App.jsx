import { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import Reset from "../user/Reset";
import Userpage from "../user/Userpage";
import Resetpassword from "../admin/Resetpassword";
import Createuser from '../admin/Createuser';
import UsersList from '../admin/UsersList';
import Login from "../Login";
import AdminSidebar from '../admin/AdminSidebar'; 
import ProductList from '../branch/ProductList'; 
import AddProduct from '../branch/AddProduct'; 
import BuyProduct from '../branch/BuyProduct'; 
import Category from '../branch/Category';
import ProductSold from '../branch/ProductSold';
import Report from '../branch/Report';
import Order from '../branch/Order';
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
import CDashboard from "../user/CDashboard"
import Dashboard from "../admin/Dashboard";
import EmployeeManagement from "../admin/EmployeeManagement";
import AdminReports from "../admin/AdminReports";
import DashBoard from "../branch/DashBoard";
import { UserProvider } from "../admin/UserContext";

function InnerApp() {
  const { cUSer, setCUSer } = useContext(UserContext);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      setCUSer(storedUser);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setCuser={setCUSer} />} />
        <Route path="/signup" element={<Signup setCuser={setCUSer} />} />
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
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="adduser" element={<Createuser />} />
          <Route path="employees" element={<EmployeeManagement />} />
          <Route path="users" element={<UsersList />} />
          <Route path="branches" element={<BranchList />} />
          <Route path="addbranch" element={<CreateBranch />} />
          <Route path="resetpassword" element={<Resetpassword />} />
          <Route path="reports" element={<AdminReports />} />
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
          <Route index element={<Navigate to="/manager/DashBoard" />} />
          <Route path="DashBoard" element={<DashBoard />} />
          <Route path="productlist" element={<ProductList />} />
          <Route path="addproduct" element={<AddProduct />} />
          <Route path="buyproduct" element={<BuyProduct />} />
          <Route path="category" element={<Category />} />
          <Route path="sellproduct" element={<ProductSold />} />
          <Route path="reports" element={<Report />} />
          <Route path="orders" element={<Order />} />
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
          <Route index element={<Navigate to="/user/dashboard" />} />
          <Route path="userpage" element={<Userpage />} />
          <Route path="CDashboard" element={<CDashboard />} />
          <Route path="security-question/:userId" element={<Security />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
        </Route>

        {/* Fallback Route */}
        <Route path="/no-access" element={<NoAccess />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <UserProvider>
      <InnerApp />
    </UserProvider>
  );
}
