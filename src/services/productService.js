// src/services/productService.js
// MOCK MODE PRODUCT SERVICE (updated: create/update/delete, sustainabilityScore)

class ProductService {
  constructor() {
    this.MOCK_MODE = true;
    this.API_BASE = "http://localhost:8080/api/products";
    // initial in-memory mock store
    this._products = this.getMockProducts();
  }

  async getProducts(filters) {
    if (this.MOCK_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          let products = [...this._products];

          if (filters) {
            if (filters.category && filters.category !== "all") {
              products = products.filter((p) => p.category === filters.category);
            }
            if (filters.search) {
              const q = filters.search.toLowerCase();
              products = products.filter(
                (p) =>
                  p.name.toLowerCase().includes(q) ||
                  p.description.toLowerCase().includes(q)
              );
            }
            if (filters.maxCarbon !== undefined && filters.maxCarbon !== null) {
              products = products.filter(
                (p) => p.carbonFootprint <= Number(filters.maxCarbon)
              );
            }
          }

          resolve(products);
        }, 250);
      });
    }

    const query = new URLSearchParams(filters);
    const res = await fetch(`${this.API_BASE}?${query}`);
    return res.json();
  }

  async getProductById(id) {
    if (this.MOCK_MODE) {
      return new Promise((resolve) =>
        setTimeout(() => {
          const p = this._products.find((x) => x.id === id) || null;
          resolve(p);
        }, 180)
      );
    }
    const res = await fetch(`${this.API_BASE}/${id}`);
    if (!res.ok) return null;
    return res.json();
  }

  async createProduct(data) {
    if (this.MOCK_MODE) {
      return new Promise((resolve) =>
        setTimeout(() => {
          const product = {
            ...data,
            id: "prod-" + Date.now(),
            createdAt: new Date().toISOString(),
          };
          // ensure numeric fields
          product.price = Number(product.price);
          product.stock = Number(product.stock);
          product.carbonFootprint = Number(product.carbonFootprint || 0);
          product.sustainabilityScore = Number(product.sustainabilityScore || 0);
          product.ecoRating = Number(product.ecoRating || 0);
          this._products.unshift(product);
          resolve(product);
        }, 300)
      );
    }

    const res = await fetch(this.API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async updateProduct(id, updates) {
    if (this.MOCK_MODE) {
      return new Promise((resolve, reject) =>
        setTimeout(() => {
          const idx = this._products.findIndex((p) => p.id === id);
          if (idx === -1) return reject(new Error("Product not found"));
          this._products[idx] = {
            ...this._products[idx],
            ...updates,
            price: updates.price !== undefined ? Number(updates.price) : this._products[idx].price,
            stock: updates.stock !== undefined ? Number(updates.stock) : this._products[idx].stock,
            carbonFootprint:
              updates.carbonFootprint !== undefined
                ? Number(updates.carbonFootprint)
                : this._products[idx].carbonFootprint,
            sustainabilityScore:
              updates.sustainabilityScore !== undefined
                ? Number(updates.sustainabilityScore)
                : this._products[idx].sustainabilityScore,
            ecoRating:
              updates.ecoRating !== undefined
                ? Number(updates.ecoRating)
                : this._products[idx].ecoRating,
          };
          resolve(this._products[idx]);
        }, 300)
      );
    }

    const res = await fetch(`${this.API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    return res.json();
  }

  async deleteProduct(id) {
    if (this.MOCK_MODE) {
      return new Promise((resolve) =>
        setTimeout(() => {
          this._products = this._products.filter((p) => p.id !== id);
          resolve();
        }, 200)
      );
    }
    await fetch(`${this.API_BASE}/${id}`, { method: "DELETE" });
  }

  // initial mock products with real images + sustainabilityScore
  getMockProducts() {
    return [
      {
        id: "p1",
        name: "Organic Cotton T-Shirt",
        description: "Soft sustainable t-shirt made from 100% organic cotton.",
        price: 29.99,
        category: "Sustainable Fashion",
        stock: 120,
        carbonFootprint: 2.5,
        sustainabilityScore: 86,
        ecoRating: 5,
        sellerId: "seller1",
        sellerName: "EcoWear",
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=80&auto=format&fit=crop",
        tags: ["organic", "cotton", "sustainable"],
        createdAt: "2024-10-01T00:00:00Z",
      },
      {
        id: "p2",
        name: "Bamboo Water Bottle",
        description: "Reusable bamboo fiber water bottle, BPA-free.",
        price: 24.99,
        category: "Eco-Friendly Products",
        stock: 85,
        carbonFootprint: 1.2,
        sustainabilityScore: 92,
        ecoRating: 5,
        sellerId: "seller2",
        sellerName: "Green Living",
        image:
          "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=1200&q=80&auto=format&fit=crop",
        tags: ["bamboo", "reusable", "eco-friendly"],
        createdAt: "2024-10-02T00:00:00Z",
      },
      {
        id: "p3",
        name: "Solar Power Bank",
        description: "Portable solar charger, 20000mAh capacity.",
        price: 49.99,
        category: "Electronics",
        stock: 60,
        carbonFootprint: 8.5,
        sustainabilityScore: 75,
        ecoRating: 4,
        sellerId: "seller3",
        sellerName: "SunTech",
        image:
          "https://images.unsplash.com/photo-1595465789875-8985dcf25809?w=1200&q=80&auto=format&fit=crop",
        tags: ["solar", "renewable", "portable"],
        createdAt: "2024-10-03T00:00:00Z",
      },
      {
        id: "p4",
        name: "Recycled Paper Notebook",
        description: "100% recycled paper, eco-friendly binding.",
        price: 12.99,
        category: "Home & Garden",
        stock: 300,
        carbonFootprint: 0.8,
        sustainabilityScore: 95,
        ecoRating: 5,
        sellerId: "seller1",
        sellerName: "EcoWear",
        image:
          "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=1200&q=80&auto=format&fit=crop",
        tags: ["recycled", "paper", "sustainable"],
        createdAt: "2024-10-04T00:00:00Z",
      },
      {
        id: "p5",
        name: "Organic Skincare Set",
        description: "Natural ingredients, cruelty-free, vegan.",
        price: 59.99,
        category: "Beauty & Personal Care",
        stock: 120,
        carbonFootprint: 3.2,
        sustainabilityScore: 88,
        ecoRating: 5,
        sellerId: "seller4",
        sellerName: "Pure Organics",
        image:
          "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=80&auto=format&fit=crop",
        tags: ["organic", "vegan", "natural"],
        createdAt: "2024-10-05T00:00:00Z",
      },
      {
        id: "p6",
        name: "LED Smart Bulb",
        description: "Energy-efficient LED bulb, WiFi enabled.",
        price: 19.99,
        category: "Electronics",
        stock: 250,
        carbonFootprint: 1.5,
        sustainabilityScore: 81,
        ecoRating: 4,
        sellerId: "seller3",
        sellerName: "SolarTech",
        image:
          "https://images.unsplash.com/photo-1550985616-10810253b84d?w=1200&q=80&auto=format&fit=crop",
        tags: ["LED", "energy-efficient", "smart"],
        createdAt: "2024-10-06T00:00:00Z",
      },
    ];
  }
}

export const productService = new ProductService();
