import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { productService } from '../../services/productService';
import { carbonService } from '../../services/carbonService';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Leaf, TrendingDown, Award, ShoppingBag, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export default function CustomerHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [products, carbonData] = await Promise.all([
        productService.getProducts(),
        carbonService.getUserInsights(user?.id || ''),
      ]);
      setFeaturedProducts(products.slice(0, 4));
      setInsights(carbonData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Carbon Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Award className="w-8 h-8 text-emerald-600" />
              <span className="text-2xl">{user?.carbonPoints || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Monthly Footprint</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Leaf className="w-8 h-8 text-green-600" />
              <span className="text-2xl">{insights?.monthlyFootprint.toFixed(1) || 0} kg</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">vs Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-8 h-8 text-blue-600" />
              <span className="text-2xl text-green-600">
                {Math.abs(insights?.comparisonToAverage || 0)}% lower
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Award className="w-8 h-8 text-yellow-600" />
              <span className="text-2xl">{insights?.achievements.length || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/customer/products')}>
          <CardContent className="p-6">
            <ShoppingBag className="w-10 h-10 text-emerald-600 mb-4" />
            <h3 className="mb-2">Browse Products</h3>
            <p className="text-sm text-gray-600 mb-4">
              Explore our eco-friendly product catalog
            </p>
            <Button variant="link" className="p-0 text-emerald-600">
              Shop Now <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/customer/insights')}>
          <CardContent className="p-6">
            <Leaf className="w-10 h-10 text-green-600 mb-4" />
            <h3 className="mb-2">Carbon Insights</h3>
            <p className="text-sm text-gray-600 mb-4">
              Track your environmental impact
            </p>
            <Button variant="link" className="p-0 text-emerald-600">
              View Report <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/customer/recommendations')}>
          <CardContent className="p-6">
            <Award className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="mb-2">AI Recommendations</h3>
            <p className="text-sm text-gray-600 mb-4">
              Personalized eco-friendly suggestions
            </p>
            <Button variant="link" className="p-0 text-emerald-600">
              Explore <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Featured Products */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Featured Eco-Friendly Products</CardTitle>
            <Button variant="link" onClick={() => navigate('/customer/products')}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="relative h-32 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-emerald-600">
                    <Leaf className="w-3 h-3 mr-1" />
                    {product.ecoRating}/5
                  </Badge>
                </div>
                <h4 className="text-sm mb-1 line-clamp-1">{product.name}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-600">${product.price}</span>
                  <span className="text-xs text-gray-500">{product.carbonFootprint} kg CO₂</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      {insights && insights.achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {insights.achievements.slice(0, 2).map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-4 p-4 bg-emerald-50 rounded-lg">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div>
                    <h4 className="mb-1">{achievement.name}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
