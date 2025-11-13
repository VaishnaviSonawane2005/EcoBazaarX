// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { toast } from 'sonner';

const AuthContext = createContext(undefined);

const SESSION_TIMEOUT = 30 * 60 * 1000;
const ACTIVITY_CHECK_INTERVAL = 60 * 1000;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Activity tracking to maintain lastActivity
  useEffect(() => {
    const updateActivity = () => localStorage.setItem('lastActivity', Date.now().toString());
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(ev => window.addEventListener(ev, updateActivity));
    return () => events.forEach(ev => window.removeEventListener(ev, updateActivity));
  }, []);

  // Load stored session on mount
  useEffect(() => {
    const stored = authService.getCurrentUser();
    if (stored) {
      const last = parseInt(localStorage.getItem('lastActivity') || Date.now().toString(), 10);
      if (Date.now() - last > SESSION_TIMEOUT) {
        authService.clearSession();
        setUser(null);
      } else {
        setUser(stored);
      }
    }
    setLoading(false);
  }, []);

  // Session timeout watcher
  useEffect(() => {
    if (!user) return;
    const id = setInterval(() => {
      const last = parseInt(localStorage.getItem('lastActivity') || Date.now().toString(), 10);
      if (Date.now() - last > SESSION_TIMEOUT) {
        toast.error('Session expired. Please login again.');
        logout();
      }
    }, ACTIVITY_CHECK_INTERVAL);
    return () => clearInterval(id);
  }, [user]);

  // API wrappers
  const login = async (identifier, password) => {
    try {
      const u = await authService.login(identifier, password);
      setUser(u);
      toast.success('Login successful!');
      return u;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const u = await authService.loginWithGoogle();
      setUser(u);
      toast.success('Login with Google successful!');
      return u;
    } catch (err) {
      toast.error('Google login failed');
      throw err;
    }
  };

  const loginWithFacebook = async () => {
    try {
      const u = await authService.loginWithFacebook();
      setUser(u);
      toast.success('Login with Facebook successful!');
      return u;
    } catch (err) {
      toast.error('Facebook login failed');
      throw err;
    }
  };

  const loginWithOTP = async (phone, otp) => {
    try {
      const u = await authService.loginWithOTP(phone, otp);
      setUser(u);
      toast.success('Login successful!');
      return u;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'OTP verification failed');
      throw err;
    }
  };

  const signup = async (data) => {
    try {
      const u = await authService.signup(data);
      setUser(u);
      if (data.role === 'SELLER') {
        toast.success('Account created! Your seller account is pending admin approval.');
      } else {
        toast.success('Account created successfully!');
      }
      return u;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Signup failed');
      throw err;
    }
  };

  const sendOTP = async (phone) => {
    try {
      await authService.sendOTP(phone);
      toast.success('OTP sent (if backend configured) — mock OTP: 123456');
    } catch (err) {
      toast.error('Failed to send OTP');
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      loginWithGoogle,
      loginWithFacebook,
      loginWithOTP,
      signup,
      sendOTP,
      logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
