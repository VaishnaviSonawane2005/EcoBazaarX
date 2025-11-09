import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { adminService } from '../../services/adminService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function PlatformAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const monthlyData = [
    { month: 'Jan', revenue: 12500, orders: 234, users: 89 },
    { month: 'Feb', revenue: 15200, orders: 289, users: 124 },
    { month: 'Mar', revenue: 18400, orders: 345, users: 167 },
    { month: 'Apr', revenue: 22100, orders: 412, users: 203 },
    { month: 'May', revenue: 19800, orders: 389, users: 189 },
    { month: 'Jun', revenue: 25600, orders: 478, users: 245 },
  ];

  const categoryData = [
    { name: 'Organic Food', value: 35, color: '#10b981' },
    { name: 'Sustainable Fashion', value: 25, color: '#8b5cf6' },
    { name: 'Eco Products', value: 20, color: '#3b82f6' },
    { name: 'Home & Garden', value: 15, color: '#f59e0b' },
    { name: 'Others', value: 5, color: '#6b7280' },
  ];

  if (loading) {
    return <div className="p-6">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2>Platform Analytics</h2>
        <p className="text-gray-600 mt-2">Detailed insights and statistics</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Revenue Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-1">+24.5%</div>
            <p className="text-sm text-green-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              vs last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Order Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-1">+18.2%</div>
            <p className="text-sm text-green-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              vs last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">New Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-1">+32.4%</div>
            <p className="text-sm text-green-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              vs last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
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
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
