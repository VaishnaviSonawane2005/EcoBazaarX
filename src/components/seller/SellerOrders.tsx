import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';

interface Order {
  id: string;
  productName: string;
  customer: string;
  quantity: number;
  total: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  orderDate: string;
}

export default function SellerOrders() {
  const [orders] = useState<Order[]>([
    {
      id: 'ORD-001',
      productName: 'Organic Cotton T-Shirt',
      customer: 'John Doe',
      quantity: 2,
      total: 59.98,
      status: 'PENDING',
      orderDate: '2024-10-25T10:30:00Z',
    },
    {
      id: 'ORD-002',
      productName: 'Bamboo Toothbrush Set',
      customer: 'Jane Smith',
      quantity: 1,
      total: 15.99,
      status: 'PROCESSING',
      orderDate: '2024-10-24T14:20:00Z',
    },
    {
      id: 'ORD-003',
      productName: 'Reusable Water Bottle',
      customer: 'Mike Johnson',
      quantity: 3,
      total: 89.97,
      status: 'SHIPPED',
      orderDate: '2024-10-23T09:15:00Z',
    },
  ]);

  const getStatusBadge = (status: Order['status']) => {
    const config = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      PROCESSING: { color: 'bg-blue-100 text-blue-800', icon: Package },
      SHIPPED: { color: 'bg-purple-100 text-purple-800', icon: Truck },
      DELIVERED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle },
    };
    const { color, icon: Icon } = config[status];
    return (
      <Badge className={color}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const statusCounts = {
    PENDING: orders.filter((o) => o.status === 'PENDING').length,
    PROCESSING: orders.filter((o) => o.status === 'PROCESSING').length,
    SHIPPED: orders.filter((o) => o.status === 'SHIPPED').length,
    DELIVERED: orders.filter((o) => o.status === 'DELIVERED').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Orders</h2>
        <p className="text-gray-600 mt-2">Manage your product orders</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl">{statusCounts.PENDING}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl">{statusCounts.PROCESSING}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Shipped</p>
                <p className="text-2xl">{statusCounts.SHIPPED}</p>
              </div>
              <Truck className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-2xl">{statusCounts.DELIVERED}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4>{order.id}</h4>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="text-gray-500">Product:</span> {order.productName}
                    </div>
                    <div>
                      <span className="text-gray-500">Customer:</span> {order.customer}
                    </div>
                    <div>
                      <span className="text-gray-500">Quantity:</span> {order.quantity}
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="text-gray-500">Order Date:</span>{' '}
                    {new Date(order.orderDate).toLocaleString()}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-emerald-600 mb-2">${order.total.toFixed(2)}</div>
                  <Button size="sm" variant="outline">
                    Update Status
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
