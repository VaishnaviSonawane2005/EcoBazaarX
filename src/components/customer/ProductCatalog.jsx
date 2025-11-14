// src/components/customer/ProductCatalog.jsx
import { useState, useEffect } from "react";
import { productService } from "../../services/productService";
import { useCart } from "../../contexts/CartContext";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import { Label } from "../ui/label";
import { Search, Leaf, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export default function ProductCatalog() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [maxCarbon, setMaxCarbon] = useState([20]);

  useEffect(() => {
    productService.getProducts().then((data) => {
      // normalize products to have consistent keys used in UI
      const normalized = (data || []).map((p) => ({
        id: p.id || p.productId || p._id || `${p.productId || Math.random()}`,
        name: p.name || p.title || 'Unnamed product',
        description: p.description || '',
        price: typeof p.price === 'string' ? parseFloat(p.price) : p.price ?? 0,
        category: p.category || 'Uncategorized',
        stock: p.stock ?? p.stockQuantity ?? 0,
        carbonFootprint: p.carbonFootprint ?? p.carbon_footprint ?? 0,
        ecoRating: p.ecoRating ?? p.carbonRating ?? 0,
        sellerName: (p.postedBy && p.postedBy.username) || p.sellerName || p.postedBy?.username || 'Unknown',
        image: p.image || p.imageUrl || p.images?.[0] || '',
        raw: p
      }));
      setProducts(normalized);
      setFiltered(normalized);
    });
  }, []);

  useEffect(() => {
    let list = [...products];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          (p.name || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q)
      );
    }

    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }

    const max = Number(maxCarbon?.[0] ?? 20);
    list = list.filter((p) => Number(p.carbonFootprint ?? 0) <= max);

    setFiltered(list);
  }, [products, search, category, maxCarbon]);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category || 'Uncategorized')))];

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4 grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <Label>Search</Label>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <Input
                className="pl-10"
                placeholder="Search products..."
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
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Max Carbon</Label>
            <div className="p-2">
              <Slider value={maxCarbon} onValueChange={setMaxCarbon} max={50} step={1} />
              <div className="text-sm text-gray-500 text-center mt-1">{maxCarbon[0]} kg CO₂</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <Card key={product.id}>
            <CardHeader className="p-0">
              <div className="h-48 bg-gray-100 relative">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 right-2 bg-emerald-600">
                  <Leaf className="w-3 h-3 mr-1" />
                  {product.ecoRating ?? 0}/5
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
              <div className="flex justify-between mt-2">
                <span className="text-emerald-600">
                  ₹{Number(product.price ?? 0).toFixed(2)}
                </span>
                <span className="text-xs text-gray-500">{Number(product.carbonFootprint ?? 0)} kg CO₂</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">by {product.sellerName}</p>
            </CardContent>

            <CardFooter>
              <Button className="w-full bg-emerald-600" onClick={() => handleAddToCart(product)}>
                <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
