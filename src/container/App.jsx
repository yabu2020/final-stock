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
import EditProfilePage from '../user/EditProfilePage';
import UserContext from '../admin/UserContext';
import CreateBranch from "../admin/CreateBranch";
import BranchList from "../admin/BranchList";
import NoAccess from "../branch/NoAccess";
import PaymentSuccess from "../user/PaymentSuccess";
import OrderHistory from "../user/OrderHistory";
import Home from "../user/Home";
import Signup from "../user/Signup";
import Help from "../user/Help";
import CustomerDashboard from "../user/CustomerDashboard"
import AdminDashboard from "../admin/AdminDashboard";
import EmployeeManagement from "../admin/EmployeeManagement";
import AdminReports from "../admin/AdminReports";
import ManagerDashboard from "../branch/ManagerDashboard";
import { UserProvider } from "../admin/UserContext";
import Modal from 'react-modal';
Modal.setAppElement('#root');

function InnerApp() {
  const { cUSer, setCUSer } = useContext(UserContext);

  // useEffect(() => {
  //   const storedUser = JSON.parse(localStorage.getItem('currentUser'));
  //   if (storedUser) {
  //     setCUSer(storedUser);
  //   }
  // }, []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
      setCUSer(storedUser);
    }
    setLoading(false);
  }, []);
  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setCuser={setCUSer} />} />
        <Route path="/signup" element={<Signup setCuser={setCUSer} />} />
        <Route path="/reset-password" element={<Resetpassword />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/reset" element={<Reset />} />


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
          <Route index element={<Navigate to="/admin/admin-dashboard" />} />
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="adduser" element={<Createuser />} />
          <Route path="employees" element={<EmployeeManagement />} />
          <Route path="users" element={<UsersList />} />
          <Route path="branches" element={<BranchList />} />
          <Route path="addbranch" element={<CreateBranch />} />
          <Route path="resetpassword" element={<Resetpassword />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="security-question/:userId" element={<Security />} />
          <Route path="edit-profile/:userId" element={<EditProfilePage />} />
          <Route path="help/:userId" element={<Help />} />
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
          <Route index element={<Navigate to="/manager/manager-dasboard" />} />
          <Route path="manager-dasboard" element={<ManagerDashboard />} />
          <Route path="productlist" element={<ProductList />} />
          <Route path="addproduct" element={<AddProduct />} />
          <Route path="buyproduct" element={<BuyProduct />} />
          <Route path="category" element={<Category />} />
          <Route path="sellproduct" element={<ProductSold />} />
          <Route path="reports" element={<Report />} />
          <Route path="orders" element={<Order />} />
          <Route path="security-question/:userId" element={<Security />} />
          <Route path="edit-profile/:userId" element={<EditProfilePage />} />
          <Route path="help/:userId" element={<Help />} />
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
          <Route index element={<Navigate to="/user/customer-dashboard" />} />
          <Route path="customer-dashboard" element={<CustomerDashboard />} />
          <Route path="userpage" element={<Userpage />} />
          <Route path="order-history" element={<OrderHistory />} />
          <Route path="security-question/:userId" element={<Security />} />
          <Route path="edit-profile/:userId" element={<EditProfilePage />} />
          <Route path="help/:userId" element={<Help />} />
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
