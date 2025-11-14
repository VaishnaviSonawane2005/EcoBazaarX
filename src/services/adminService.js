// src/services/adminService.js
// MOCK MODE ADMIN SERVICE (added approveSeller, createProduct passthrough for admin flows)

class AdminService {
  constructor() {
    this.MOCK_MODE = true;
    // store of users (same shape as earlier)
    this._users = this.getMockUsers();
  }

  async getAllUsers() {
    if (this.MOCK_MODE) {
      return new Promise((resolve) =>
        setTimeout(() => resolve([...this._users]), 250)
      );
    }
    const res = await fetch("/api/admin/users");
    return res.json();
  }

  async deleteUser(id) {
    if (this.MOCK_MODE) {
      return new Promise((resolve) =>
        setTimeout(() => {
          this._users = this._users.filter((u) => u.id !== id);
          resolve();
        }, 200)
      );
    }
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
  }

  async approveSeller(userId, approve = true) {
    if (this.MOCK_MODE) {
      return new Promise((resolve, reject) =>
        setTimeout(() => {
          const idx = this._users.findIndex((u) => u.id === userId);
          if (idx === -1) return reject(new Error("User not found"));
          this._users[idx].sellerStatus = approve ? "APPROVED" : "REJECTED";
          resolve(this._users[idx]);
        }, 300)
      );
    }

    const res = await fetch(`/api/admin/users/${userId}/approve`, {
      method: "POST",
      body: JSON.stringify({ approve }),
      headers: { "Content-Type": "application/json" },
    });
    return res.json();
  }

  async deleteProduct(id) {
    if (this.MOCK_MODE) {
      return new Promise((resolve) => setTimeout(resolve, 200));
    }
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
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
