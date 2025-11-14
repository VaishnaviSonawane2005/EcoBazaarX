// src/components/customer/Recommendations.jsx
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
    if (user) loadRecommendations();
    else {
      // if user not logged in, still load generic recommendations (optional)
      // setRecommendations([]);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadRecommendations = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await recommendationService.getPersonalizedRecommendations(user.id);
      // normalize if API returns array of { product, score, reason } or product objects
      const normalized = (data || []).map((entry) => {
        if (entry.product) {
          return {
            product: {
              id: entry.product.id || entry.product.productId || entry.product._id,
              name: entry.product.name,
              description: entry.product.description,
              image: entry.product.image || entry.product.imageUrl,
              price: typeof entry.product.price === 'string' ? parseFloat(entry.product.price) : entry.product.price ?? 0,
              carbonFootprint: entry.product.carbonFootprint ?? entry.product.carbon_footprint ?? 0,
              ecoRating: entry.product.ecoRating ?? 0,
              stock: entry.product.stock ?? entry.product.stockQuantity ?? 0,
              sellerName: entry.product.sellerName || entry.product.postedBy?.username || 'Unknown',
            },
            score: entry.score ?? 0,
            reason: entry.reason ?? ''
          };
        }
        // fallback if entry is product
        return {
          product: {
            id: entry.id || entry.productId,
            name: entry.name,
            description: entry.description,
            image: entry.image || entry.imageUrl,
            price: entry.price ?? 0,
            carbonFootprint: entry.carbonFootprint ?? entry.carbon_footprint ?? 0,
            ecoRating: entry.ecoRating ?? 0,
            stock: entry.stock ?? entry.stockQuantity ?? 0,
            sellerName: entry.sellerName || entry.postedBy?.username || 'Unknown',
          },
          score: entry.score ?? 0,
          reason: entry.reason ?? ''
        };
      });
      setRecommendations(normalized);
    } catch (err) {
      console.error('Failed to load recommendations', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (!product) return;
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-600 rounded-full p-3">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="mb-1">AI-Powered Recommendations</h2>
              <p className="text-sm text-gray-600">Personalized eco-friendly product suggestions based on your shopping behavior</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="mb-4">Just For You</h3>
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-md" />
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {recommendations.map(({ product, score, reason }) => (
              <Card key={product?.id || product?.name} className="hover:shadow-lg transition-shadow border-2 border-emerald-100">
                <CardHeader className="p-0">
                  <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                    <ImageWithFallback src={product?.image} alt={product?.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-purple-600">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {Math.round((score ?? 0) * 100)}% Match
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-emerald-600">
                        <Leaf className="w-3 h-3 mr-1" />
                        {product?.ecoRating ?? 0}/5
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4">
                  <h3 className="mb-1 line-clamp-1">{product?.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product?.description}</p>

                  {reason && (
                    <div className="flex items-center gap-2 mb-3 p-2 bg-blue-50 rounded-lg">
                      <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <p className="text-xs text-blue-800">{reason}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-emerald-600">₹{Number(product?.price ?? 0).toFixed(2)}</span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Leaf className="w-3 h-3" />
                      {Number(product?.carbonFootprint ?? 0)} kg CO₂
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">by {product?.sellerName}</p>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => handleAddToCart(product)} disabled={product?.stock === 0}>
                    <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
