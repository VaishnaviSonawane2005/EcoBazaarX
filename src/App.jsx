/**
 * EcoBazaarX - Carbon Footprint Aware E-Commerce Platform
 * 
 * Frontend MVP Implementation (React + Vite)
 * Backend Ready: Spring Boot + MySQL integration points available
 * 
 * KEY FEATURES:
 * ✅ Role-based authentication (Admin, Seller, Customer)
 * ✅ Admin can only LOGIN (not signup) - Credentials: admin@ecobazaarx.com / EcoAdmin@2024
 * ✅ Sellers require admin approval before they can list products
 * ✅ Customers can signup/login freely and start shopping
 * ✅ Multi-auth support: Email/Password, Google, Facebook, OTP
 * ✅ Modern UI similar to Myntra/Amazon/Flipkart
 * ✅ Eco-friendly theme with carbon tracking
 * 
 * ROUTES:
 * / - Landing page with features
 * /login - Multi-method login page
 * /signup - Customer/Seller signup (no Admin signup)
 * /marketplace - Guest read-only product browsing
 * /admin/* - Admin dashboard (user management, seller approvals, analytics)
 * /seller/* - Seller dashboard (products, orders, analytics)
 * /customer/* - Customer dashboard (shop, cart, orders, carbon insights)
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Toaster } from './components/ui/sonner';
import SessionTimeout from './components/SessionTimeout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import GuestMarketplace from './pages/GuestMarketplace';
import AdminDashboard from './pages/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import SellerDashboard from './pages/SellerDashboard';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    const redirectMap = {
      ADMIN: '/admin',
      SELLER: '/seller',
      CUSTOMER: '/customer',
    };
    return <Navigate to={redirectMap[user.role]} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to={`/${user.role.toLowerCase()}`} replace /> : <LoginPage />} />
      <Route path="/signup" element={user ? <Navigate to={`/${user.role.toLowerCase()}`} replace /> : <SignupPage />} />
      <Route path="/marketplace" element={<GuestMarketplace />} />
      
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/seller/*"
        element={
          <ProtectedRoute allowedRoles={['SELLER']}>
            <SellerDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/customer/*"
        element={
          <ProtectedRoute allowedRoles={['CUSTOMER']}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
          <Toaster position="top-right" richColors />
          <SessionTimeout />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
