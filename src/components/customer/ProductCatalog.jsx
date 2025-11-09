import { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { useCart } from '../../contexts/CartContext';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { Search, Leaf, ShoppingCart, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export default function ProductCatalog() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [maxCarbon, setMaxCarbon] = useState([20]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, search, category, maxCarbon]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== 'all') {
      filtered = filtered.filter((p) => p.category === category);
    }

    filtered = filtered.filter((p) => p.carbonFootprint <= maxCarbon[0]);

    setFilteredProducts(filtered);
  };

  const categories = ['all', ...new Set(products.map((p) => p.category))];

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label>Search Products</Label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Max Carbon (kg CO₂)</Label>
              <div className="mt-2 px-2">
                <Slider
                  value={maxCarbon}
                  onValueChange={setMaxCarbon}
                  max={20}
                  min={0}
                  step={1}
                />
                <div className="text-sm text-gray-600 mt-1 text-center">{maxCarbon[0]} kg</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          [...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-600 mb-2">No products found</h3>
            <p className="text-sm text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Badge className="bg-emerald-600">
                      <Leaf className="w-3 h-3 mr-1" />
                      {product.ecoRating}/5
                    </Badge>
                  </div>
                  {product.stock < 20 && (
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="destructive">Only {product.stock} left</Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
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
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
