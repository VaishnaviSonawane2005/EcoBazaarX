import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Package, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';

export default function SellerHome() {
  const { user } = useAuth();
  
  const stats = {
    totalProducts: 12,
    totalOrders: 45,
    revenue: 2345.50,
    growth: 23.5,
  };

  if (user?.sellerStatus === 'PENDING') {
    return (
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-8 text-center">
          <Package className="w-16 h-16 text-amber-600 mx-auto mb-4" />
          <h2 className="mb-2">Account Pending Approval</h2>
          <p className="text-gray-600 mb-4">
            Your seller application is currently under review by our admin team. 
            You'll receive an email notification once your account is approved.
          </p>
          <p className="text-sm text-amber-800">
            This process typically takes 1-2 business days.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (user?.sellerStatus === 'REJECTED') {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-8 text-center">
          <Package className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="mb-2">Application Not Approved</h2>
          <p className="text-gray-600 mb-4">
            Unfortunately, your seller application was not approved at this time.
            Please contact our support team for more information.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Package className="w-8 h-8 text-emerald-600" />
              <span className="text-2xl">{stats.totalProducts}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-8 h-8 text-blue-600" />
              <span className="text-2xl">{stats.totalOrders}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="w-8 h-8 text-green-600" />
              <span className="text-2xl">${stats.revenue.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <span className="text-2xl text-green-600">+{stats.growth}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Your Seller Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Manage your products, track orders, and analyze your sales performance all in one place.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50 rounded-lg">
              <h4 className="mb-2">Getting Started</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Add your first product with carbon data</li>
                <li>• Set competitive pricing</li>
                <li>• Upload high-quality product images</li>
                <li>• Write detailed eco-friendly descriptions</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="mb-2">Best Practices</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Accurately calculate carbon footprint</li>
                <li>• Provide transparent product information</li>
                <li>• Respond quickly to customer inquiries</li>
                <li>• Ship sustainably and on time</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
