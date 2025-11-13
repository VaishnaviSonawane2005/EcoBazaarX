// src/services/authService.js
// Hybrid AuthService: tries backend; falls back to mock when backend fails or MOCK_MODE = true.

export const ADMIN_CREDENTIALS = {
  email: 'admin@ecobazaarx.com',
  password: 'EcoAdmin@2024',
};

const USER_KEY = 'ecobazaarx_user';
const TOKEN_KEY = 'ecobazaarx_token';

const nowISO = () => new Date().toISOString();

const INITIAL_MOCK_USERS = [
  {
    id: 'admin-001',
    username: 'admin_master',
    email: ADMIN_CREDENTIALS.email,
    firstName: 'System',
    lastName: 'Administrator',
    role: 'ADMIN',
    sellerStatus: undefined,
    phone: undefined,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

class AuthService {
  constructor() {
    // Change base if your backend is on a different port (used when MOCK_MODE=false)
    this.API_BASE = 'http://localhost:8080';
    this.USER_KEY = USER_KEY;
    this.TOKEN_KEY = TOKEN_KEY;

    // Default mode: try backend first; if backend fails, auto-fallback to mock.
    // You can force mock-only mode by setting this.FORCE_MOCK = true;
    this.FORCE_MOCK = false;

    // mock store (in-memory + seeding)
    this._mockUsers = [...INITIAL_MOCK_USERS];
  }

  // storage helpers
  getCurrentUser() {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  saveSession(user, token) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    if (token) localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem('lastActivity', Date.now().toString());
  }

  clearSession() {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('lastActivity');
  }

  // ---------- HYBRID: Attempt backend call, fallback to mock if it fails ----------
  async _tryBackend(path, payload) {
    if (this.FORCE_MOCK) {
      throw new Error('FORCE_MOCK enabled');
    }
    const url = `${this.API_BASE}${path}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || 'Backend error');
    }
    const data = await res.json();
    return data;
  }

  // login: accepts email or username
  async login(identifier, password) {
    // first try backend
    try {
      const payload = identifier.includes('@') ? { email: identifier, password } : { username: identifier, password };
      const data = await this._tryBackend('/login', payload);
      // backend expected to return { user, token } or {user, token}
      const user = data.user || data;
      const token = data.token || (data.user && data.user.token) || null;
      this.saveSession(user, token);
      return user;
    } catch (err) {
      // fallback to mock
      return this._mockLogin(identifier, password);
    }
  }

  // signup/register
  async signup(data) {
    try {
      const backendData = await this._tryBackend('/register', data);
      const user = backendData.user || backendData;
      const token = backendData.token || null;
      this.saveSession(user, token);
      return user;
    } catch (err) {
      return this._mockSignup(data);
    }
  }

  async loginWithGoogle() {
    // attempt backend oauth endpoint then fallback
    try {
      const data = await this._tryBackend('/oauth/google', {});
      const user = data.user || data;
      const token = data.token || null;
      this.saveSession(user, token);
      return user;
    } catch {
      // mock
      return this._mockSocial('Google');
    }
  }

  async loginWithFacebook() {
    try {
      const data = await this._tryBackend('/oauth/facebook', {});
      const user = data.user || data;
      const token = data.token || null;
      this.saveSession(user, token);
      return user;
    } catch {
      return this._mockSocial('Facebook');
    }
  }

  async sendOTP(phone) {
    try {
      await this._tryBackend('/send-otp', { phone });
      return;
    } catch {
      // mock: console log
      console.log('Mock OTP sent to', phone, '— use 123456');
      return;
    }
  }

  async loginWithOTP(phone, otp) {
    try {
      const data = await this._tryBackend('/login/otp', { phone, otp });
      const user = data.user || data;
      const token = data.token || null;
      this.saveSession(user, token);
      return user;
    } catch {
      // mock
      if (otp === '123456') {
        const user = {
          id: 'otp-' + Date.now(),
          username: 'otp_user_' + Date.now().toString().slice(-4),
          email: `${phone.replace(/\D/g, '')}@ecobazaarx.com`,
          firstName: 'OTP',
          lastName: 'User',
          phone,
          role: 'USER',
          createdAt: nowISO(),
        };
        this._mockUsers.push(user);
        this.saveSession(user, 'mock-otp-token');
        return user;
      } else {
        throw new Error('Invalid OTP (mock). Use 123456');
      }
    }
  }

  async logout() {
    this.clearSession();
  }

  // ----------------- MOCK IMPLEMENTATIONS -----------------
  _findMockByIdentifier(identifier) {
    return this._mockUsers.find(u => (u.email && u.email === identifier) || (u.username && u.username === identifier));
  }

  _mockLogin(identifier, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // admin credentials
        if (identifier === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
          const admin = this._mockUsers.find(u => u.role === 'ADMIN');
          this.saveSession(admin, 'mock-admin-token');
          resolve(admin);
          return;
        }

        const user = this._findMockByIdentifier(identifier);
        if (user && (password === 'password123' || password === ADMIN_CREDENTIALS.password)) {
          this.saveSession(user, 'mock-token-' + user.id);
          resolve(user);
        } else {
          reject(new Error('Invalid credentials (mock). Use password123 for mock users.'));
        }
      }, 500);
    });
  }

  _mockSignup(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // basic validation
        if (!data.username || !data.password || !data.email || !data.firstName || !data.lastName) {
          reject(new Error('Missing required fields (mock).'));
          return;
        }
        if (this._mockUsers.some(u => u.email === data.email)) {
          reject(new Error('Email already registered (mock).'));
          return;
        }
        if (this._mockUsers.some(u => u.username === data.username)) {
          reject(new Error('Username already taken (mock).'));
          return;
        }
        const id = 'user-' + Date.now();
        const newUser = {
          id,
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          role: data.role || 'USER',
          sellerStatus: data.role === 'SELLER' ? 'PENDING' : undefined,
          createdAt: nowISO(),
        };
        this._mockUsers.push(newUser);
        this.saveSession(newUser, 'mock-token-' + id);
        resolve(newUser);
      }, 700);
    });
  }

  _mockSocial(provider) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = {
          id: provider.toLowerCase() + '-' + Date.now(),
          username: `${provider.toLowerCase()}_user_${Date.now().toString().slice(-4)}`,
          email: `${provider.toLowerCase()}_${Date.now().toString().slice(-4)}@example.com`,
          firstName: provider,
          lastName: 'User',
          role: 'USER',
          createdAt: nowISO(),
        };
        this._mockUsers.push(user);
        this.saveSession(user, `mock-${provider.toLowerCase()}-token`);
        resolve(user);
      }, 600);
    });
  }
}

export const authService = new AuthService();
export default authService;
