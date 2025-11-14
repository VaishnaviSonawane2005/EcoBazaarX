// src/pages/CustomerDashboard.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import DashboardLayout from '../components/DashboardLayout';

import CustomerHome from '../components/customer/CustomerHome';
import ProductCatalog from '../components/customer/ProductCatalog';
import Cart from '../components/customer/Cart';
import CarbonInsights from '../components/customer/CarbonInsights';
import Recommendations from '../components/customer/Recommendations';
import CarbonPoints from '../components/customer/CarbonPoints';
import Orders from '../components/customer/Orders';

import {
  ShoppingBag,
  BarChart3,
  Sparkles,
  Award,
  Package,
  Home
} from 'lucide-react';

export default function CustomerDashboard() {
  const { user } = useAuth();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/customer" },
    { icon: ShoppingBag, label: "Products", path: "/customer/products" },
    { icon: Package, label: "My Orders", path: "/customer/orders" },
    { icon: BarChart3, label: "Carbon Insights", path: "/customer/insights" },
    { icon: Sparkles, label: "Recommendations", path: "/customer/recommendations" },
    { icon: Award, label: "Carbon Points", path: "/customer/points" },
  ];

  return (
    <DashboardLayout
      title={`Welcome, ${user?.firstName || user?.name || "User"}!`}
      role="CUSTOMER"
      menuItems={menuItems}
    >
      <Routes>
        <Route path="/" element={<CustomerHome />} />
        <Route path="/products" element={<ProductCatalog />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/insights" element={<CarbonInsights />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/points" element={<CarbonPoints />} />
        <Route path="*" element={<Navigate to="/customer" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
