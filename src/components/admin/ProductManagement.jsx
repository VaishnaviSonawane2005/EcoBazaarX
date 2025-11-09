import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { productService } from '../../services/productService';
import { adminService } from '../../services/adminService';
import { Search, Leaf, DollarSign, Package, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await adminService.deleteProduct(productId);
      setProducts(products.filter((p) => p.id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category) => {
    const colors = {
      'Organic Food': 'bg-green-100 text-green-800',
      'Sustainable Fashion': 'bg-purple-100 text-purple-800',
      'Eco-Friendly Products': 'bg-blue-100 text-blue-800',
      'Home & Garden': 'bg-amber-100 text-amber-800',
      'Electronics': 'bg-indigo-100 text-indigo-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="p-6">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2>Product Management</h2>
        <p className="text-gray-600 mt-2">Manage all products on the platform</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by product name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-white/90 text-emerald-800">
                    <Leaf className="w-3 h-3 mr-1" />
                    {product.carbonFootprint} kg CO₂
                  </Badge>
                </div>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="mb-1">{product.name}</h4>
                      <Badge className={getCategoryColor(product.category)}>
                        {product.category}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-emerald-600">
                        <DollarSign className="w-4 h-4" />
                        <span>{product.price.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <Package className="w-4 h-4" />
                        <span>{product.stock} in stock</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Product
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                No products found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
