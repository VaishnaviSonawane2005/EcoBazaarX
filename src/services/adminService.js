// src/services/adminService.js
// MOCK MODE ADMIN SERVICE

class AdminService {
  constructor() {
    this.MOCK_MODE = true;
  }

  async getAllUsers() {
    return new Promise((resolve) =>
      setTimeout(() => resolve(this.getMockUsers()), 300)
    );
  }

  async deleteUser(id) {
    return new Promise((resolve) => setTimeout(resolve, 200));
  }

  async deleteProduct(id) {
    return new Promise((resolve) => setTimeout(resolve, 200));
  }

  getMockUsers() {
    return [
      {
        id: "u1",
        username: "adminmaster",
        firstName: "System",
        lastName: "Admin",
        email: "admin@ecobazaarx.com",
        role: "ADMIN",
        sellerStatus: null,
        carbonPoints: 0,
        createdAt: "2024-01-12T00:00:00Z",
      },
      {
        id: "u2",
        username: "john123",
        firstName: "John",
        lastName: "Doe",
        email: "john@gmail.com",
        role: "USER",
        sellerStatus: null,
        carbonPoints: 120,
        createdAt: "2024-02-20T00:00:00Z",
      },
      {
        id: "u3",
        username: "ecoSeller",
        firstName: "Mary",
        lastName: "Fernandes",
        email: "mary@sellers.com",
        role: "SELLER",
        sellerStatus: "APPROVED",
        carbonPoints: 300,
        createdAt: "2024-02-10T00:00:00Z",
      },
    ];
  }
}

export const adminService = new AdminService();
