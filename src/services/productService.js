// Mock Product Service - Ready for Spring Boot Backend Integration
// API Endpoint: http://localhost:8080/api/products

class ProductService {
  constructor() {
    this.API_BASE = 'http://localhost:8080/api/products';
    this.MOCK_MODE = true;
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
            if (filters.minPrice) {
              products = products.filter((p) => p.price >= filters.minPrice);
            }
            if (filters.maxPrice) {
              products = products.filter((p) => p.price <= filters.maxPrice);
            }
            if (filters.maxCarbon) {
              products = products.filter((p) => p.carbonFootprint <= filters.maxCarbon);
            }
            if (filters.search) {
              const term = filters.search.toLowerCase();
              products = products.filter(
                (p) =>
                  p.name.toLowerCase().includes(term) ||
                  p.description.toLowerCase().includes(term)
              );
            }
          }
          
          resolve(products);
        }, 500);
      });
    }

    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`${this.API_BASE}?${queryParams}`);
    return response.json();
  }

  async getProductById(id) {
    if (this.MOCK_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const product = this.getMockProducts().find((p) => p.id === id);
          resolve(product || null);
        }, 300);
      });
    }

    const response = await fetch(`${this.API_BASE}/${id}`);
    if (!response.ok) return null;
    return response.json();
  }

  async createProduct(data) {
    if (this.MOCK_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const product = {
            ...data,
            id: 'prod-' + Date.now(),
            createdAt: new Date().toISOString(),
          };
          resolve(product);
        }, 500);
      });
    }

    const response = await fetch(this.API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async getAllProducts() {
    return this.getProducts();
  }

  getMockProducts() {
    return [
      {
        id: 'prod-1',
        name: 'Organic Cotton T-Shirt',
        description: 'Sustainable organic cotton t-shirt, ethically sourced',
        price: 29.99,
        category: 'Clothing',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        carbonFootprint: 2.5,
        ecoRating: 5,
        sellerId: 'seller-1',
        sellerName: 'EcoFashion Co.',
        stock: 150,
        tags: ['organic', 'cotton', 'sustainable'],
        createdAt: '2024-10-01T00:00:00Z',
      },
      {
        id: 'prod-2',
        name: 'Bamboo Water Bottle',
        description: 'Reusable bamboo fiber water bottle, BPA-free',
        price: 24.99,
        category: 'Home & Kitchen',
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
        carbonFootprint: 1.2,
        ecoRating: 5,
        sellerId: 'seller-2',
        sellerName: 'Green Living',
        stock: 200,
        tags: ['bamboo', 'reusable', 'eco-friendly'],
        createdAt: '2024-10-02T00:00:00Z',
      },
      {
        id: 'prod-3',
        name: 'Solar Power Bank',
        description: 'Portable solar charger, 20000mAh capacity',
        price: 49.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
        carbonFootprint: 8.5,
        ecoRating: 4,
        sellerId: 'seller-3',
        sellerName: 'SolarTech',
        stock: 80,
        tags: ['solar', 'renewable', 'portable'],
        createdAt: '2024-10-03T00:00:00Z',
      },
      {
        id: 'prod-4',
        name: 'Recycled Paper Notebook',
        description: '100% recycled paper, eco-friendly binding',
        price: 12.99,
        category: 'Stationery',
        image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400',
        carbonFootprint: 0.8,
        ecoRating: 5,
        sellerId: 'seller-1',
        sellerName: 'EcoFashion Co.',
        stock: 300,
        tags: ['recycled', 'paper', 'sustainable'],
        createdAt: '2024-10-04T00:00:00Z',
      },
      {
        id: 'prod-5',
        name: 'Organic Skincare Set',
        description: 'Natural ingredients, cruelty-free, vegan',
        price: 59.99,
        category: 'Beauty',
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
        carbonFootprint: 3.2,
        ecoRating: 5,
        sellerId: 'seller-4',
        sellerName: 'Pure Organics',
        stock: 120,
        tags: ['organic', 'vegan', 'natural'],
        createdAt: '2024-10-05T00:00:00Z',
      },
      {
        id: 'prod-6',
        name: 'LED Smart Bulb',
        description: 'Energy-efficient LED bulb, WiFi enabled',
        price: 19.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=400',
        carbonFootprint: 1.5,
        ecoRating: 4,
        sellerId: 'seller-3',
        sellerName: 'SolarTech',
        stock: 250,
        tags: ['LED', 'energy-efficient', 'smart'],
        createdAt: '2024-10-06T00:00:00Z',
      },
    ];
  }
}

export const productService = new ProductService();
