import { useState, useEffect } from "react";
import { productService } from "../services/productService";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Leaf, Search, ShoppingCart } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Link, useNavigate } from "react-router-dom";

export default function GuestMarketplace() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    productService.getProducts().then(setProducts);
  }, []);

  const list = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <header className="bg-white border-b p-4 flex justify-between items-center">
        <Link to="/" className="text-emerald-600 flex items-center gap-2">
          <Leaf className="w-6 h-6" />
          <span className="text-xl">EcoBazaarX</span>
        </Link>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button className="bg-emerald-600" onClick={() => navigate("/signup")}>
            Sign Up
          </Button>
        </div>
      </header>

      <div className="bg-emerald-600 text-white py-10 px-4">
        <h1 className="text-3xl mb-2">Eco-Friendly Marketplace</h1>
        <p className="opacity-90 mb-4">Browse sustainable products</p>

        <div className="max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" />
            <Input
              className="pl-10 bg-white"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {list.map((p) => (
          <Card key={p.id} className="hover:shadow-lg">
            <CardHeader className="p-0">
              <div className="relative h-48 bg-gray-100">
                <ImageWithFallback
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 right-2 bg-emerald-600">
                  <Leaf className="w-3 h-3 mr-1" />
                  {p.ecoRating}/5
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <h3>{p.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {p.description}
              </p>

              <div className="flex justify-between mt-2">
                <span className="text-emerald-600">₹{p.price}</span>
                <span className="text-xs text-gray-500">
                  {p.carbonFootprint} kg CO₂
                </span>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                onClick={() => navigate("/signup")}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Sign Up to Buy
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
