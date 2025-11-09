import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import SellerHome from '../components/seller/SellerHome';
import SellerProducts from '../components/seller/SellerProducts';
import SellerOrders from '../components/seller/SellerOrders';
import SellerAnalytics from '../components/seller/SellerAnalytics';
import AddProduct from '../components/seller/AddProduct';
import { Package, ShoppingBag, BarChart3, Plus, Home } from 'lucide-react';

export default function SellerDashboard() {
  const { user } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/seller' },
    { icon: Package, label: 'My Products', path: '/seller/products' },
    { icon: Plus, label: 'Add Product', path: '/seller/add-product' },
    { icon: ShoppingBag, label: 'Orders', path: '/seller/orders' },
    { icon: BarChart3, label: 'Analytics', path: '/seller/analytics' },
  ];

  return (
    <DashboardLayout 
      title={`Welcome, ${user?.name}!`} 
      role="SELLER"
      menuItems={menuItems}
    >
      {user?.sellerStatus === 'PENDING' && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="text-amber-900 mb-1">Account Pending Approval</h3>
          <p className="text-sm text-amber-800">
            Your seller account is awaiting admin verification. You'll be able to list products once approved.
          </p>
        </div>
      )}

      {user?.sellerStatus === 'REJECTED' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-900 mb-1">Account Rejected</h3>
          <p className="text-sm text-red-800">
            Your seller application was not approved. Please contact support for more information.
          </p>
        </div>
      )}

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
