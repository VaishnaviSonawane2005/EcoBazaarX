// Mock Auth Service - Ready for Spring Boot Backend Integration
// API Endpoint: http://localhost:8080/api/auth
//
// DEMO CREDENTIALS:
// -----------------
// Admin Login:
//   Email: admin@ecobazaarx.com
//   Password: EcoAdmin@2024
//
// For testing Seller/Customer accounts:
//   - Sign up as Customer: Instant access to customer dashboard
//   - Sign up as Seller: Account will be in PENDING status until admin approves
//   - Social login (Google/Facebook): Creates customer account automatically
//   - OTP Login: Use any phone number and OTP: 123456
//
// Admin cannot sign up - only login with predefined credentials above

// Mock users database (replace with actual API calls)
const MOCK_USERS = [
  {
    id: 'admin-001',
    email: 'admin@ecobazaarx.com',
    name: 'System Administrator',
    role: 'ADMIN',
    carbonPoints: 0,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

// Dummy Admin Credentials
export const ADMIN_CREDENTIALS = {
  email: 'admin@ecobazaarx.com',
  password: 'EcoAdmin@2024',
};

class AuthService {
  constructor() {
    this.API_BASE = 'http://localhost:8080/api/auth'; // Spring Boot backend
    this.TOKEN_KEY = 'ecobazaarx_token';
    this.USER_KEY = 'ecobazaarx_user';
    this.MOCK_MODE = true; // Mock mode flag - set to false when backend is ready
  }

  getCurrentUser() {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  saveSession(user, token) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem('lastActivity', Date.now().toString());
  }

  async login(email, password) {
    if (this.MOCK_MODE) {
      // Mock implementation
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Check admin credentials
          if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
            const adminUser = MOCK_USERS[0];
            this.saveSession(adminUser, 'mock-admin-token');
            resolve(adminUser);
            return;
          }

          // Check other mock users
          const user = MOCK_USERS.find((u) => u.email === email);
          if (user && password === 'password123') {
            this.saveSession(user, 'mock-token-' + user.id);
            resolve(user);
          } else {
            reject(new Error('Invalid email or password'));
          }
        }, 800);
      });
    }

    // Real API call (when backend is ready)
    const response = await fetch(`${this.API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    this.saveSession(data.user, data.token);
    return data.user;
  }

  async loginWithGoogle() {
    if (this.MOCK_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const user = {
            id: 'google-' + Date.now(),
            email: 'user@gmail.com',
            name: 'Google User',
            role: 'CUSTOMER',
            carbonPoints: 100,
            createdAt: new Date().toISOString(),
          };
          this.saveSession(user, 'mock-google-token');
          resolve(user);
        }, 1000);
      });
    }

    // Real implementation would use Google OAuth
    const response = await fetch(`${this.API_BASE}/oauth/google`, {
      method: 'POST',
    });
    const data = await response.json();
    this.saveSession(data.user, data.token);
    return data.user;
  }

  async loginWithFacebook() {
    if (this.MOCK_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const user = {
            id: 'fb-' + Date.now(),
            email: 'user@facebook.com',
            name: 'Facebook User',
            role: 'CUSTOMER',
            carbonPoints: 100,
            createdAt: new Date().toISOString(),
          };
          this.saveSession(user, 'mock-fb-token');
          resolve(user);
        }, 1000);
      });
    }

    const response = await fetch(`${this.API_BASE}/oauth/facebook`, {
      method: 'POST',
    });
    const data = await response.json();
    this.saveSession(data.user, data.token);
    return data.user;
  }

  async loginWithOTP(phone, otp) {
    if (this.MOCK_MODE) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (otp === '123456') {
            const user = {
              id: 'otp-' + Date.now(),
              email: `${phone}@ecobazaarx.com`,
              name: 'OTP User',
              role: 'CUSTOMER',
              phone,
              carbonPoints: 50,
              createdAt: new Date().toISOString(),
            };
            this.saveSession(user, 'mock-otp-token');
            resolve(user);
          } else {
            reject(new Error('Invalid OTP'));
          }
        }, 800);
      });
    }

    const response = await fetch(`${this.API_BASE}/login/otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp }),
    });

    if (!response.ok) {
      throw new Error('OTP verification failed');
    }

    const data = await response.json();
    this.saveSession(data.user, data.token);
    return data.user;
  }

  async signup(data) {
    if (this.MOCK_MODE) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Check if email already exists
          if (MOCK_USERS.some((u) => u.email === data.email)) {
            reject(new Error('Email already registered'));
            return;
          }

          const user = {
            id: 'user-' + Date.now(),
            email: data.email,
            name: data.name,
            role: data.role,
            phone: data.phone,
            sellerStatus: data.role === 'SELLER' ? 'PENDING' : undefined,
            carbonPoints: 100,
            createdAt: new Date().toISOString(),
          };

          MOCK_USERS.push(user);
          this.saveSession(user, 'mock-token-' + user.id);
          resolve(user);
        }, 1000);
      });
    }

    const response = await fetch(`${this.API_BASE}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Signup failed');
    }

    const result = await response.json();
    this.saveSession(result.user, result.token);
    return result.user;
  }

  async sendOTP(phone) {
    if (this.MOCK_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('Mock OTP sent to:', phone, '- Use: 123456');
          resolve();
        }, 500);
      });
    }

    const response = await fetch(`${this.API_BASE}/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });

    if (!response.ok) {
      throw new Error('Failed to send OTP');
    }
  }

  logout() {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    // Clear other user-specific data
    localStorage.removeItem('ecobazaarx_cart');
    localStorage.removeItem('userSettings');
    localStorage.removeItem('currentUser');
  }
}

export const authService = new AuthService();
