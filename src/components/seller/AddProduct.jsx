import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { Upload, Leaf } from 'lucide-react';

export default function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    carbonFootprint: '',
    sustainabilityScore: '',
  });

  const categories = [
    'Organic Food',
    'Sustainable Fashion',
    'Eco-Friendly Products',
    'Home & Garden',
    'Electronics',
    'Beauty & Personal Care',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Mock product creation
    toast.success('Product added successfully!');
    navigate('/seller/products');
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2>Add New Product</h2>
        <p className="text-gray-600 mt-2">List a new eco-friendly product</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Organic Cotton T-Shirt"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (USD) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="29.99"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="100"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your eco-friendly product..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carbonFootprint" className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  Carbon Footprint (kg CO₂)
                </Label>
                <Input
                  id="carbonFootprint"
                  type="number"
                  step="0.01"
                  placeholder="2.5"
                  value={formData.carbonFootprint}
                  onChange={(e) => setFormData({ ...formData, carbonFootprint: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sustainabilityScore">Sustainability Score (0-100)</Label>
                <Input
                  id="sustainabilityScore"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="85"
                  value={formData.sustainabilityScore}
                  onChange={(e) => setFormData({ ...formData, sustainabilityScore: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Product Images</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-gray-50 cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                Add Product
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/seller/products')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
