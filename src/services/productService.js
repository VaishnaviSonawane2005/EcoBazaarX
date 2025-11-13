// src/services/productService.js
// MOCK MODE PRODUCT SERVICE

class ProductService {
  constructor() {
    this.MOCK_MODE = true;
    this.API_BASE = "http://localhost:8080/api/products";
  }

  async getProducts(filters) {
    if (this.MOCK_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          let products = this.getMockProducts();

          if (filters) {
            if (filters.category) {
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
            if (filters.maxCarbon) {
              products = products.filter(
                (p) => p.carbonFootprint <= filters.maxCarbon
              );
            }
          }

          resolve(products);
        }, 300);
      });
    }

    const query = new URLSearchParams(filters);
    const res = await fetch(`${this.API_BASE}?${query}`);
    return res.json();
  }

  async getAllProducts() {
    return this.getProducts();
  }

  async deleteProduct(id) {
    if (this.MOCK_MODE) {
      return new Promise((resolve) => setTimeout(resolve, 200));
    }
    await fetch(`${this.API_BASE}/${id}`, { method: "DELETE" });
  }

  getMockProducts() {
    return [
      {
        id: "p1",
        name: "Organic Cotton T-Shirt",
        description: "Soft organic cotton shirt made sustainably.",
        price: 29.99,
        category: "Clothing",
        stock: 120,
        carbonFootprint: 2.5,
        ecoRating: 5,
        sellerId: "seller1",
        sellerName: "EcoWear",
        image:
          "https://images.unsplash.com/photo-1530650042471-0a3f4e1e3d2c?w=800",
      },
      {
        id: "p2",
        name: "Bamboo Water Bottle",
        description: "Reusable bamboo fiber water bottle, BPA-free.",
        price: 22.99,
        category: "Home",
        stock: 85,
        carbonFootprint: 1.4,
        ecoRating: 5,
        sellerId: "seller2",
        sellerName: "Green Living Co.",
        image:
          "https://images.unsplash.com/photo-1526401485004-2aa7c3a0a4a5?w=800",
      },
      {
        id: "p3",
        name: "Solar Power Bank",
        description: "Eco-friendly solar charging bank.",
        price: 49.99,
        category: "Electronics",
        stock: 60,
        carbonFootprint: 6.3,
        ecoRating: 4,
        sellerId: "seller3",
        sellerName: "SunTech",
        image:
          "https://images.unsplash.com/photo-1620912189865-5b2c2c932a0e?w=800",
      },
    ];
  }
}

export const productService = new ProductService();
