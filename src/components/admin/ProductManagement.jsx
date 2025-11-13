import { useState, useEffect } from "react";
import { productService } from "../../services/productService";
import { adminService } from "../../services/adminService";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Search, Leaf, Package, DollarSign, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    productService.getProducts().then(setProducts);
  }, []);

  const removeProduct = async (id) => {
    if (!confirm("Delete product?")) return;
    await adminService.deleteProduct(id);
    setProducts(products.filter((p) => p.id !== id));
    toast.success("Product deleted");
  };

  const list = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h2>Product Management</h2>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((p) => (
              <Card key={p.id}>
                <div className="relative h-40 bg-gray-100">
                  <img
                    src={p.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-white text-emerald-700">
                    <Leaf className="w-3 h-3 mr-1" />
                    {p.carbonFootprint} kg
                  </Badge>
                </div>

                <CardContent>
                  <h3>{p.name}</h3>
                  <Badge>{p.category}</Badge>

                  <div className="flex justify-between mt-2">
                    <span className="text-emerald-600 flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {p.price}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Package className="w-4 h-4" />
                      {p.stock} left
                    </span>
                  </div>

                  <p className="text-xs mt-2 line-clamp-2">
                    {p.description}
                  </p>

                  <Button
                    variant="ghost"
                    className="text-red-600 w-full mt-3"
                    onClick={() => removeProduct(p.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
