import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { recommendationService } from '../../services/recommendationService';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Sparkles, Leaf, ShoppingCart, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export default function Recommendations() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRecommendations();
    }
  }, [user]);

  const loadRecommendations = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await recommendationService.getPersonalizedRecommendations(user.id);
      setRecommendations(data);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-600 rounded-full p-3">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="mb-1">AI-Powered Recommendations</h2>
              <p className="text-sm text-gray-600">
                Personalized eco-friendly product suggestions based on your shopping behavior and preferences
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <div>
        <h3 className="mb-4">Just For You</h3>
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {recommendations.map(({ product, score, reason }) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow border-2 border-emerald-100">
                <CardHeader className="p-0">
                  <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-purple-600">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {Math.round(score * 100)}% Match
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-emerald-600">
                        <Leaf className="w-3 h-3 mr-1" />
                        {product.ecoRating}/5
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center gap-2 mb-3 p-2 bg-blue-50 rounded-lg">
                    <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <p className="text-xs text-blue-800">{reason}</p>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-emerald-600">${product.price.toFixed(2)}</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Leaf className="w-3 h-3" />
                      {product.carbonFootprint} kg CO₂
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">by {product.sellerName}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Why These Recommendations */}
      <Card>
        <CardHeader>
          <h3>How We Recommend Products</h3>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 rounded-lg">
              <TrendingDown className="w-8 h-8 text-emerald-600 mb-2" />
              <h4 className="text-sm mb-1">Low Carbon Priority</h4>
              <p className="text-xs text-gray-600">
                We prioritize products with lower carbon footprints
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <Sparkles className="w-8 h-8 text-blue-600 mb-2" />
              <h4 className="text-sm mb-1">AI-Powered</h4>
              <p className="text-xs text-gray-600">
                Machine learning analyzes your preferences
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <Leaf className="w-8 h-8 text-purple-600 mb-2" />
              <h4 className="text-sm mb-1">Eco-Friendly Focus</h4>
              <p className="text-xs text-gray-600">
                Only sustainable and verified products
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
