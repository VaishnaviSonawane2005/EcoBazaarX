// src/components/seller/SellerProducts.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table";

import { Eye, Edit, Trash2, Leaf } from "lucide-react";
import { toast } from "sonner";

export default function SellerProducts() {
  const navigate = useNavigate();

  // Dump mock DB data (structure matching your DB)
  const [products] = useState([
    {
      id: 1,
      name: "Organic Cotton T-Shirt",
      category: "Clothing",
      price: 29.99,
      stock: 150,
      carbonFootprint: 2.5,
      ecoRating: 5,
      status: "ACTIVE"
    },
    {
      id: 2,
      name: "Bamboo Water Bottle",
      category: "Home",
      price: 24.99,
      stock: 200,
      carbonFootprint: 1.2,
      ecoRating: 5,
      status: "ACTIVE"
    }
  ]);

  const handleDelete = (name) => toast.success(`${name} deleted successfully`);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2>My Products</h2>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={() => navigate("/seller/add-product")}
        >
          Add New Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Carbon</TableHead>
                <TableHead>Eco Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell className="text-emerald-600">${p.price}</TableCell>
                  <TableCell><Badge>{p.stock} units</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Leaf className="w-4 h-4 text-emerald-600" />
                      {p.carbonFootprint}
                    </div>
                  </TableCell>
                  <TableCell>{p.ecoRating} ⭐</TableCell>
                  <TableCell>
                    <Badge className={p.status === "ACTIVE" ? "bg-green-600" : "bg-gray-600"}>{p.status}</Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Eye className="cursor-pointer" />
                      <Edit className="cursor-pointer" />
                      <Trash2 className="cursor-pointer text-red-600" onClick={() => handleDelete(p.name)} />
                    </div>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>

          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
