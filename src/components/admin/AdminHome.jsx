import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { adminService } from '../../services/adminService';
import { Users, Package, ShoppingCart, DollarSign, Leaf, UserCheck, Store, Clock } from 'lucide-react';

export default function AdminHome() {
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

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers.toLocaleString() || '0',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts.toLocaleString() || '0',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders.toLocaleString() || '0',
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Revenue',
      value: `$${stats?.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0'}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'CO₂ Saved',
      value: `${stats?.carbonSaved.toLocaleString()} kg`,
      icon: Leaf,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
    },
    {
      title: 'Active Customers',
      value: stats?.activeCustomers.toLocaleString() || '0',
      icon: UserCheck,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
    {
      title: 'Active Sellers',
      value: stats?.activeSellers.toLocaleString() || '0',
      icon: Store,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Pending Sellers',
      value: stats?.pendingSellers.toLocaleString() || '0',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2>Platform Overview</h2>
        <p className="text-gray-600 mt-2">
          Monitor key metrics and manage your EcoBazaarX platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">{stat.title}</CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-3 border-b">
                <div className="bg-green-100 p-2 rounded-full">
                  <UserCheck className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">New seller application submitted</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">15 new products added</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <ShoppingCart className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">42 orders placed today</p>
                  <p className="text-xs text-gray-500">8 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full p-3 text-left border rounded-lg hover:bg-emerald-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <div>
                    <p>Review Seller Applications</p>
                    <p className="text-xs text-gray-500">{stats?.pendingSellers || 0} pending</p>
                  </div>
                </div>
              </button>
              <button className="w-full p-3 text-left border rounded-lg hover:bg-emerald-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-purple-600" />
                  <div>
                    <p>Manage Products</p>
                    <p className="text-xs text-gray-500">View all products</p>
                  </div>
                </div>
              </button>
              <button className="w-full p-3 text-left border rounded-lg hover:bg-emerald-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <p>User Management</p>
                    <p className="text-xs text-gray-500">Manage users</p>
                  </div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
