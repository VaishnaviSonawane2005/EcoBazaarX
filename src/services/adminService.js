// Admin Service - Ready for Spring Boot Backend Integration
// API Endpoint: http://localhost:8080/api/admin

class AdminService {
  constructor() {
    this.API_BASE = 'http://localhost:8080/api/admin';
    this.MOCK_MODE = true;
  }

  async getDashboardStats() {
    if (this.MOCK_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            totalUsers: 1247,
            totalProducts: 856,
            totalOrders: 3421,
            totalRevenue: 125430.50,
            carbonSaved: 8234.5,
            activeCustomers: 1123,
            activeSellers: 89,
            pendingSellers: 12,
          });
        }, 500);
      });
    }

    const response = await fetch(`${this.API_BASE}/stats`);
    return response.json();
  }

  async getAllUsers() {
    if (this.MOCK_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 'user-1',
              email: 'customer1@example.com',
              name: 'John Doe',
              role: 'CUSTOMER',
              carbonPoints: 250,
              createdAt: '2024-09-01T00:00:00Z',
            },
            {
              id: 'user-2',
              email: 'seller1@example.com',
              name: 'Jane Smith',
              role: 'SELLER',
              sellerStatus: 'APPROVED',
              carbonPoints: 0,
              createdAt: '2024-08-15T00:00:00Z',
            },
          ]);
        }, 500);
      });
    }

    const response = await fetch(`${this.API_BASE}/users`);
    return response.json();
  }

  async getSellerApplications() {
    if (this.MOCK_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 'app-1',
              userId: 'user-3',
              userName: 'Alice Johnson',
              email: 'alice@ecofarm.com',
              businessName: 'Alice Organic Farm',
              businessType: 'Agricultural Producer',
              gstNumber: 'GST123456789',
              documents: ['license.pdf', 'certificate.pdf'],
              status: 'PENDING',
              appliedAt: '2024-10-20T00:00:00Z',
            },
            {
              id: 'app-2',
              userId: 'user-4',
              userName: 'Bob Williams',
              email: 'bob@greentech.com',
              businessName: 'GreenTech Solutions',
              businessType: 'Electronics Retailer',
              documents: ['registration.pdf'],
              status: 'PENDING',
              appliedAt: '2024-10-22T00:00:00Z',
            },
          ]);
        }, 500);
      });
    }

    const response = await fetch(`${this.API_BASE}/seller-applications`);
    return response.json();
  }

  async reviewSellerApplication(applicationId, decision, notes) {
    if (this.MOCK_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(`Application ${applicationId} ${decision}`, notes);
          resolve();
        }, 500);
      });
    }

    const response = await fetch(`${this.API_BASE}/seller-applications/${applicationId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision, notes }),
    });

    if (!response.ok) {
      throw new Error('Failed to review application');
    }
  }

  async deleteProduct(productId) {
    if (this.MOCK_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('Product deleted:', productId);
          resolve();
        }, 300);
      });
    }

    const response = await fetch(`${this.API_BASE}/products/${productId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
  }

  async deleteUser(userId) {
    if (this.MOCK_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('User deleted:', userId);
          resolve();
        }, 300);
      });
    }

    const response = await fetch(`${this.API_BASE}/users/${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  }
}

export const adminService = new AdminService();
