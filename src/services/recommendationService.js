// AI Recommendation Service - Ready for Python AI Backend Integration
// API Endpoint: http://localhost:8080/api/recommendations

class RecommendationService {
  constructor() {
    this.API_BASE = 'http://localhost:8080/api/recommendations';
    this.MOCK_MODE = true;
  }

  async getPersonalizedRecommendations(userId) {
    if (this.MOCK_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              product: {
                id: 'prod-7',
                name: 'Bamboo Toothbrush Set',
                description: 'Biodegradable bamboo toothbrushes, pack of 4',
                price: 15.99,
                category: 'Personal Care',
                image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400',
                carbonFootprint: 0.5,
                ecoRating: 5,
                sellerId: 'seller-5',
                sellerName: 'Zero Waste Co.',
                stock: 180,
                tags: ['bamboo', 'biodegradable', 'zero-waste'],
                createdAt: '2024-10-10T00:00:00Z',
              },
              score: 0.95,
              reason: 'Based on your eco-friendly purchases',
            },
            {
              product: {
                id: 'prod-8',
                name: 'Reusable Food Wraps',
                description: 'Beeswax food wraps, set of 3',
                price: 18.99,
                category: 'Home & Kitchen',
                image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
                carbonFootprint: 0.3,
                ecoRating: 5,
                sellerId: 'seller-2',
                sellerName: 'Green Living',
                stock: 220,
                tags: ['reusable', 'beeswax', 'sustainable'],
                createdAt: '2024-10-11T00:00:00Z',
              },
              score: 0.88,
              reason: 'Popular among users with similar preferences',
            },
          ]);
        }, 600);
      });
    }

    const response = await fetch(`${this.API_BASE}/personalized/${userId}`);
    return response.json();
  }

  async getSimilarProducts(productId) {
    if (this.MOCK_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 'prod-9',
              name: 'Hemp Backpack',
              description: 'Durable hemp fiber backpack',
              price: 69.99,
              category: 'Bags',
              image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
              carbonFootprint: 4.2,
              ecoRating: 4,
              sellerId: 'seller-1',
              sellerName: 'EcoFashion Co.',
              stock: 85,
              tags: ['hemp', 'durable', 'sustainable'],
              createdAt: '2024-10-12T00:00:00Z',
            },
          ]);
        }, 400);
      });
    }

    const response = await fetch(`${this.API_BASE}/similar/${productId}`);
    return response.json();
  }

  async getLowCarbonAlternatives(productId) {
    if (this.MOCK_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 'prod-10',
              name: 'Second-Hand Laptop',
              description: 'Refurbished laptop, like new condition',
              price: 399.99,
              category: 'Electronics',
              image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
              carbonFootprint: 15.0,
              ecoRating: 4,
              sellerId: 'seller-3',
              sellerName: 'SolarTech',
              stock: 15,
              tags: ['refurbished', 'second-hand', 'electronics'],
              createdAt: '2024-10-13T00:00:00Z',
            },
          ]);
        }, 400);
      });
    }

    const response = await fetch(`${this.API_BASE}/low-carbon/${productId}`);
    return response.json();
  }
}

export const recommendationService = new RecommendationService();
