import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Edit, Trash2, Eye, Leaf } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  carbonFootprint: number;
  status: 'active' | 'inactive';
}

export default function SellerProducts() {
  const [products] = useState<Product[]>([
    { id: '1', name: 'Organic Cotton T-Shirt', category: 'Clothing', price: 29.99, stock: 150, carbonFootprint: 2.5, status: 'active' },
    { id: '2', name: 'Bamboo Water Bottle', category: 'Home & Kitchen', price: 24.99, stock: 200, carbonFootprint: 1.2, status: 'active' },
    { id: '3', name: 'Recycled Paper Notebook', category: 'Stationery', price: 12.99, stock: 300, carbonFootprint: 0.8, status: 'active' },
  ]);

  const handleDelete = (id: string, name: string) => {
    toast.success(`${name} deleted successfully`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2>My Products</h2>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          Add New Product
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Carbon (kg CO₂)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-emerald-600">${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={product.stock < 50 ? 'destructive' : 'outline'}>
                      {product.stock} units
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Leaf className="w-4 h-4 text-emerald-600" />
                      {product.carbonFootprint}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={product.status === 'active' ? 'bg-green-600' : 'bg-gray-600'}>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(product.id, product.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
