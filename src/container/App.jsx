// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminSidebar from "../admin/AdminSidebar";
import FlourPurchase from "../admin/FlourPurchase";
import Bread from "../admin/Bread";
import Baking from "../admin/Baking";
import Sales from "../admin/Sales";
import Expense from "../admin/Expense";
import ProfitLossReport from "../admin/ProfitLossReport";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminSidebar />}>
          <Route index element={<Navigate to="addproduct" replace />} />
          <Route path="addproduct" element={<FlourPurchase />} />
          <Route path="productlist" element={<Bread />} />
          <Route path="baking" element={<Baking />} />
          <Route path="sellproduct" element={<Sales />} />
          <Route path="expense" element={<Expense />} />
          <Route path="report" element={<ProfitLossReport />} />
          <Route path="*" element={<div>404 – Page not found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}