import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Package, Truck, CheckCircle, XCircle, Leaf } from 'lucide-react';

export default function Orders() {
  const [orders] = useState([
    { id: 'ORD-2024-001', date: '2024-10-25', status: 'delivered', items: 3, total: 89.97, carbonFootprint: 6.5 },
    { id: 'ORD-2024-002', date: '2024-10-20', status: 'delivered', items: 2, total: 54.98, carbonFootprint: 3.7 },
    { id: 'ORD-2024-003', date: '2024-10-15', status: 'delivered', items: 1, total: 29.99, carbonFootprint: 2.5 },
    { id: 'ORD-2024-004', date: '2024-10-10', status: 'cancelled', items: 2, total: 45.50, carbonFootprint: 0 },
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Package className="w-5 h-5 text-yellow-600" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      shipped: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return <Badge className={colors[status]}>{status.toUpperCase()}</Badge>;
  };

  const filterOrders = (status) => {
    if (!status) return orders;
    return orders.filter((order) => order.status === status);
  };

  const OrderList = ({ orders }) => (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>No orders found</p>
        </div>
      ) : (
        orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  {getStatusIcon(order.status)}
                  <div>
                    <h4 className="mb-1">Order {order.id}</h4>
                    <p className="text-sm text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
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
                <div className="flex items-end">
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">
              {orders.filter((o) => o.status === 'delivered').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-emerald-600">
              ${orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">CO₂ Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-blue-600">
              {orders.reduce((sum, o) => sum + o.carbonFootprint, 0).toFixed(1)} kg
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <OrderList orders={orders} />
            </TabsContent>
            <TabsContent value="delivered" className="mt-6">
              <OrderList orders={filterOrders('delivered')} />
            </TabsContent>
            <TabsContent value="pending" className="mt-6">
              <OrderList orders={filterOrders('pending')} />
            </TabsContent>
            <TabsContent value="cancelled" className="mt-6">
              <OrderList orders={filterOrders('cancelled')} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
