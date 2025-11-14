// src/components/seller/SellerOrders.jsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

import { Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

export default function SellerOrders() {
  const [orders] = useState([
    {
      id: 101,
      productName: "Organic Cotton T-Shirt",
      customer: "John Doe",
      status: "Processing",
      quantity: 2,
      total: 59.98
    },
    {
      id: 102,
      productName: "Bamboo Water Bottle",
      customer: "Mary Fernandes",
      status: "Shipped",
      quantity: 1,
      total: 24.99
    },
    {
      id: 103,
      productName: "Solar Power Bank",
      customer: "Sophia Green",
      status: "Delivered",
      quantity: 1,
      total: 49.99
    }
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing": return <Clock className="w-4 h-4 text-amber-600" />;
      case "Shipped": return <Truck className="w-4 h-4 text-blue-600" />;
      case "Delivered": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Cancelled": return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const handleStatusUpdate = (id, status) => {
    toast.success(`Order ${id} updated to ${status}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Orders</CardTitle></CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>{o.productName}</TableCell>
                  <TableCell>{o.customer}</TableCell>
                  <TableCell>
                    <Badge className="flex gap-1 items-center">
                      {getStatusIcon(o.status)}
                      {o.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{o.quantity}</TableCell>
                  <TableCell className="text-emerald-600">${o.total}</TableCell>

                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(o.id, "Shipped")}>
                        Mark Shipped
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(o.id, "Delivered")}>
                        Mark Delivered
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(o.id, "Cancelled")}>
                        Cancel
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
