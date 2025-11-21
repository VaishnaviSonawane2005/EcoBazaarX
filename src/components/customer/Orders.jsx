import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Package, Truck, CheckCircle, XCircle, Leaf } from "lucide-react";

// 👉 Shared mock orders (replace later with API)
const ordersList = [
  { id: "ORD-2024-001", date: "2024-10-25", status: "delivered", items: 3, total: 89.97, carbonFootprint: 6.5 },
  { id: "ORD-2024-002", date: "2024-10-20", status: "delivered", items: 2, total: 54.98, carbonFootprint: 3.7 },
  { id: "ORD-2024-003", date: "2024-10-15", status: "delivered", items: 1, total: 29.99, carbonFootprint: 2.5 },
  { id: "ORD-2024-004", date: "2024-10-10", status: "cancelled", items: 2, total: 45.5, carbonFootprint: 0 },
];

export default function Orders() {
  const navigate = useNavigate();
  const [orders] = useState(ordersList);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Package className="w-5 h-5 text-yellow-600" />;
      case "shipped": return <Truck className="w-5 h-5 text-blue-600" />;
      case "delivered": return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "cancelled": return <XCircle className="w-5 h-5 text-red-600" />;
      default: return null;
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      shipped: "bg-blue-100 text-blue-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return <Badge className={colors[status]}>{status.toUpperCase()}</Badge>;
  };

  const filterOrders = (status) =>
    !status ? orders : orders.filter((o) => o.status === status);

  const OrderList = ({ orders }) => (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                {getStatusIcon(order.status)}
                <div>
                  <h4>Order {order.id}</h4>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {getStatusBadge(order.status)}
            </div>

            <div className="grid md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-600 mb-1">Items</p>
                <p className="text-sm">{order.items} products</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Total Amount</p>
                <p className="text-sm text-emerald-600">${order.total.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Carbon Footprint</p>
                <p className="text-sm flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-emerald-600" />
                  {order.carbonFootprint} kg CO₂
                </p>
              </div>

              {/* ⭐ Navigate to Order Details */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate(`/customer/orders/${order.id}`)}
                >
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">

      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value="all"><OrderList orders={orders} /></TabsContent>
            <TabsContent value="delivered"><OrderList orders={filterOrders("delivered")} /></TabsContent>
            <TabsContent value="pending"><OrderList orders={filterOrders("pending")} /></TabsContent>
            <TabsContent value="cancelled"><OrderList orders={filterOrders("cancelled")} /></TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
