// src/App.jsx
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

// Stable mapping between roles and route paths
const redirectMap = {
  ADMIN: '/admin',
  SELLER: '/seller',
  USER: '/customer',
};

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    // if role does not match allowed roles, redirect to their dashboard
    return <Navigate to={redirectMap[user.role] || '/'} replace />;
  }

  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/login"
        element={!user ? <LoginPage /> : <Navigate to={redirectMap[user.role] || '/'} replace />}
      />

      <Route
        path="/signup"
        element={!user ? <SignupPage /> : <Navigate to={redirectMap[user.role] || '/'} replace />}
      />

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
          <ProtectedRoute allowedRoles={['USER']}>
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
