// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { Toaster } from "./components/ui/sonner";
import SessionTimeout from "./components/SessionTimeout";

// ---------- PUBLIC PAGES ----------
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import GuestMarketplace from "./pages/GuestMarketplace";

// ---------- DASHBOARDS ----------
import AdminDashboard from "./pages/AdminDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import SellerDashboard from "./pages/SellerDashboard";

// ---------- ROLE REDIRECT MAP ----------
const redirectMap = {
  ADMIN: "/admin",
  SELLER: "/seller",
  USER: "/customer",
};

// ---------- PROTECTED ROUTE ----------
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={redirectMap[user.role] || "/"} replace />;
  }

  return children;
}

// ---------- ROUTES ----------
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/marketplace" element={<GuestMarketplace />} />

      {/* AUTH ROUTES */}
      <Route
        path="/login"
        element={!user ? <LoginPage /> : <Navigate to={redirectMap[user.role]} replace />}
      />
      <Route
        path="/signup"
        element={!user ? <SignupPage /> : <Navigate to={redirectMap[user.role]} replace />}
      />

      {/* =============== ADMIN ROUTES =============== */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* =============== SELLER ROUTES =============== */}
      <Route
        path="/seller/*"
        element={
          <ProtectedRoute allowedRoles={["SELLER"]}>
            <SellerDashboard />
          </ProtectedRoute>
        }
      />

      {/* =============== CUSTOMER ROUTES =============== */}
      <Route
        path="/customer/*"
        element={
          <ProtectedRoute allowedRoles={["USER"]}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// ---------- APP WRAPPER ----------
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
