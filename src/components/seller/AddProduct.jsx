// src/components/seller/AddProduct.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "../ui/select";

import { Upload, Leaf, Star } from "lucide-react";
import { toast } from "sonner";

export default function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    carbonFootprint: "",
    ecoRating: "",
    image: "",
  });

  const categories = [
    "Clothing",
    "Home",
    "Electronics",
    "Beauty",
    "Personal Care",
    "Accessories",
    "Kitchen",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      toast.error("Please fill all required fields.");
      return;
    }

    toast.success("Product added successfully! (Mock Mode)");
    navigate("/seller/products");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2>Add New Product</h2>
        <p className="text-gray-600 mt-1">
          List a new eco-friendly product on EcoBazaarX.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Product Name */}
            <div className="space-y-2">
              <Label>Product Name *</Label>
              <Input
                placeholder="Organic Cotton T-Shirt"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category *</Label>

              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price & Stock */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price (USD) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="29.99"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Stock Quantity *</Label>
                <Input
                  type="number"
                  placeholder="100"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                rows={4}
                placeholder="Describe your eco-friendly product"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            {/* Carbon & Rating */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  Carbon Footprint (kg CO₂)
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="2.5"
                  value={formData.carbonFootprint}
                  onChange={(e) =>
                    setFormData({ ...formData, carbonFootprint: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Eco Rating (1–5)
                </Label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  placeholder="5"
                  value={formData.ecoRating}
                  onChange={(e) =>
                    setFormData({ ...formData, ecoRating: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Image Upload URL */}
            <div className="space-y-2">
              <Label>Product Image URL</Label>
              <Input
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
              />
            </div>

            {/* Upload Box (mock only) */}
            <div className="space-y-2">
              <Label>Upload Image (mock)</Label>

              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 mx-auto text-gray-400" />
                <p className="text-sm text-gray-600 mt-1">
                  Drag & drop or click to upload (not functional in mock mode)
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button type="submit" className="flex-1 bg-emerald-600">
                Add Product
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/seller/products")}
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
