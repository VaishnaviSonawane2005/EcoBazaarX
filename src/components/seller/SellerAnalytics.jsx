import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, ShoppingCart, Package, TrendingUp } from 'lucide-react';

export default function SellerAnalytics() {
  const salesData = [
    { month: 'Jan', sales: 2400, orders: 24 },
    { month: 'Feb', sales: 3200, orders: 32 },
    { month: 'Mar', sales: 2800, orders: 28 },
    { month: 'Apr', sales: 4100, orders: 41 },
    { month: 'May', sales: 3800, orders: 38 },
    { month: 'Jun', sales: 4500, orders: 45 },
  ];

  const stats = [
    {
      title: 'Total Revenue',
      value: '$20,800',
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'Total Orders',
      value: '208',
      change: '+8.2%',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Products Listed',
      value: '12',
      change: '+2',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Growth Rate',
      value: '24.8%',
      change: '+4.3%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2>Analytics</h2>
        <p className="text-gray-600 mt-2">Track your sales performance</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl">{stat.value}</span>
                  <span className="text-sm text-green-600 mb-1">{stat.change}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Organic Cotton T-Shirt', sales: 145, revenue: 4350 },
              { name: 'Bamboo Toothbrush Set', sales: 89, revenue: 1423 },
              { name: 'Reusable Water Bottle', sales: 67, revenue: 2010 },
              { name: 'Eco-Friendly Tote Bag', sales: 54, revenue: 1620 },
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="mb-1">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.sales} units sold</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-600">${product.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
