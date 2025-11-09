// Carbon Analytics Service - Ready for Python AI Backend Integration
// API Endpoint: http://localhost:8080/api/carbon

class CarbonService {
  constructor() {
    this.API_BASE = 'http://localhost:8080/api/carbon';
    this.MOCK_MODE = true;
  }

  async getUserInsights(userId) {
    if (this.MOCK_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            userId,
            totalFootprint: 245.8,
            monthlyFootprint: 42.3,
            categoryBreakdown: [
              { category: 'Clothing', footprint: 15.2 },
              { category: 'Electronics', footprint: 18.5 },
              { category: 'Home & Kitchen', footprint: 5.8 },
              { category: 'Beauty', footprint: 2.8 },
            ],
            comparisonToAverage: -23, // 23% below average
            recommendations: [
              'Choose products with lower carbon footprint',
              'Consider buying second-hand electronics',
              'Use reusable containers instead of disposables',
            ],
            carbonPoints: 1250,
            achievements: [
              {
                id: 'ach-1',
                name: 'Eco Warrior',
                description: 'Saved 100kg CO2',
                icon: '🌱',
                earnedAt: '2024-09-15T00:00:00Z',
              },
              {
                id: 'ach-2',
                name: 'Green Shopper',
                description: '50 eco-friendly purchases',
                icon: '🛍️',
                earnedAt: '2024-10-01T00:00:00Z',
              },
            ],
          });
        }, 500);
      });
    }

    const response = await fetch(`${this.API_BASE}/insights/${userId}`);
    return response.json();
  }

  async getReport(userId, period) {
    if (this.MOCK_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const data = this.generateMockReportData(period);
          resolve({
            period,
            data,
            totalFootprint: data.reduce((sum, d) => sum + d.footprint, 0),
            reduction: 12.5,
          });
        }, 500);
      });
    }

    const response = await fetch(`${this.API_BASE}/report/${userId}?period=${period}`);
    return response.json();
  }

  async calculateProductFootprint(productId) {
    if (this.MOCK_MODE) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(Math.random() * 10);
        }, 300);
      });
    }

    const response = await fetch(`${this.API_BASE}/calculate/${productId}`);
    const data = await response.json();
    return data.footprint;
  }

  generateMockReportData(period) {
    const days = period === 'week' ? 7 : period === 'month' ? 30 : 365;
    const data = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      data.push({
        date: date.toISOString().split('T')[0],
        footprint: Math.random() * 5 + 1,
      });
    }
    
    return data;
  }
}

export const carbonService = new CarbonService();
