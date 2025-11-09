import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import AdminHome from '../components/admin/AdminHome';
import UserManagement from '../components/admin/UserManagement';
import SellerApplications from '../components/admin/SellerApplications';
import ProductManagement from '../components/admin/ProductManagement';
import PlatformAnalytics from '../components/admin/PlatformAnalytics';
import { Users, CheckSquare, Package, BarChart3, Home } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: CheckSquare, label: 'Seller Applications', path: '/admin/applications' },
    { icon: Package, label: 'Product Management', path: '/admin/products' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  ];

  return (
    <DashboardLayout 
      title={`Admin Panel - ${user?.name}`} 
      role="ADMIN"
      menuItems={menuItems}
    >
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/applications" element={<SellerApplications />} />
        <Route path="/products" element={<ProductManagement />} />
        <Route path="/analytics" element={<PlatformAnalytics />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
