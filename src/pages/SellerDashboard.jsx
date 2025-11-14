// src/pages/SellerDashboard.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import DashboardLayout from "../components/DashboardLayout";

import SellerHome from "../components/seller/SellerHome";
import SellerProducts from "../components/seller/SellerProducts";
import AddProduct from "../components/seller/AddProduct";
import SellerOrders from "../components/seller/SellerOrders";
import SellerAnalytics from "../components/seller/SellerAnalytics";

import { Package, ShoppingBag, BarChart3, Plus, Home } from "lucide-react";

export default function SellerDashboard() {
  const { user } = useAuth();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/seller" },
    { icon: Package, label: "My Products", path: "/seller/products" },
    { icon: Plus, label: "Add Product", path: "/seller/add-product" },
    { icon: ShoppingBag, label: "Orders", path: "/seller/orders" },
    { icon: BarChart3, label: "Analytics", path: "/seller/analytics" },
  ];

  return (
    <DashboardLayout title={`Welcome, ${user?.firstName || user?.name}!`} role="SELLER" menuItems={menuItems}>
      <Routes>
        <Route path="/" element={<SellerHome />} />
        <Route path="/products" element={<SellerProducts />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/orders" element={<SellerOrders />} />
        <Route path="/analytics" element={<SellerAnalytics />} />
        <Route path="*" element={<Navigate to="/seller" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
