import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Leaf, Search, ShoppingCart, Leaf as LeafIcon } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function GuestMarketplace() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-emerald-600">
              <Leaf className="w-6 h-6" />
              <span className="text-xl">EcoBazaarX</span>
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="mb-4">Explore Our Eco-Friendly Products</h1>
          <p className="text-lg text-white/90 mb-6">
            Browse our curated selection of sustainable products (Read-only mode)
          </p>
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10 bg-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-emerald-600">
                        <LeafIcon className="w-3 h-3 mr-1" />
                        {product.ecoRating}/5
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-emerald-600">${product.price.toFixed(2)}</span>
                    <span className="text-xs text-gray-500">{product.carbonFootprint} kg CO₂</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/signup')}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Sign up to Purchase
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No products found matching your search.</p>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="bg-emerald-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-4">Ready to Start Shopping?</h2>
          <p className="text-gray-600 mb-6">
            Sign up now to purchase products and track your carbon footprint
          </p>
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate('/signup')}>
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
}
