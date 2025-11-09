import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { toast } from 'sonner';

const AuthContext = createContext(undefined);

// Session timeout: 30 minutes in milliseconds
const SESSION_TIMEOUT = 30 * 60 * 1000;
const ACTIVITY_CHECK_INTERVAL = 60 * 1000; // Check every minute

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Track user activity
  useEffect(() => {
    const updateActivity = () => {
      setLastActivity(Date.now());
      localStorage.setItem('lastActivity', Date.now().toString());
    };

    // Update activity on user interactions
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      window.addEventListener(event, updateActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, []);

  // Check for session timeout
  useEffect(() => {
    if (!user) return;

    const checkTimeout = setInterval(() => {
      const lastActivityTime = parseInt(localStorage.getItem('lastActivity') || Date.now().toString());
      const currentTime = Date.now();
      const timeSinceActivity = currentTime - lastActivityTime;

      if (timeSinceActivity > SESSION_TIMEOUT) {
        // Session expired
        toast.error('Session expired. Please login again.');
        logout();
      }
    }, ACTIVITY_CHECK_INTERVAL);

    return () => clearInterval(checkTimeout);
  }, [user]);

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      // Check if session is still valid
      const lastActivityTime = parseInt(localStorage.getItem('lastActivity') || Date.now().toString());
      const timeSinceActivity = Date.now() - lastActivityTime;
      
      if (timeSinceActivity > SESSION_TIMEOUT) {
        // Session expired
        authService.logout();
        toast.error('Session expired. Please login again.');
      } else {
        setUser(storedUser);
        setLastActivity(lastActivityTime);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      toast.success('Login successful!');
      return userData;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const userData = await authService.loginWithGoogle();
      setUser(userData);
      toast.success('Login with Google successful!');
      return userData;
    } catch (error) {
      toast.error('Google login failed');
      throw error;
    }
  };

  const loginWithFacebook = async () => {
    try {
      const userData = await authService.loginWithFacebook();
      setUser(userData);
      toast.success('Login with Facebook successful!');
      return userData;
    } catch (error) {
      toast.error('Facebook login failed');
      throw error;
    }
  };

  const loginWithOTP = async (phone, otp) => {
    try {
      const userData = await authService.loginWithOTP(phone, otp);
      setUser(userData);
      toast.success('Login successful!');
      return userData;
    } catch (error) {
      toast.error('OTP verification failed');
      throw error;
    }
  };

  const signup = async (data) => {
    try {
      const userData = await authService.signup(data);
      setUser(userData);
      
      if (data.role === 'SELLER') {
        toast.success('Account created! Your seller account is pending admin approval.');
      } else {
        toast.success('Account created successfully!');
      }
      return userData;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Signup failed');
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
        loginWithFacebook,
        loginWithOTP,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
