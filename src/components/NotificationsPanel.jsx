import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { 
  Bell, 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  Award,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';

const DUMMY_NOTIFICATIONS = {
  CUSTOMER: [
    {
      id: 1,
      type: 'order',
      icon: Package,
      title: 'Order Delivered',
      message: 'Your order #12345 has been delivered successfully!',
      time: '2 hours ago',
      read: false,
      priority: 'success'
    },
    {
      id: 2,
      type: 'carbon',
      icon: Award,
      title: 'Carbon Points Earned',
      message: 'You earned 50 carbon points for eco-friendly purchases!',
      time: '5 hours ago',
      read: false,
      priority: 'info'
    },
    {
      id: 3,
      type: 'recommendation',
      icon: TrendingUp,
      title: 'New Recommendations',
      message: 'Check out new eco-friendly products recommended for you',
      time: '1 day ago',
      read: true,
      priority: 'info'
    },
    {
      id: 4,
      type: 'order',
      icon: ShoppingBag,
      title: 'Order Shipped',
      message: 'Your order #12344 is on its way. Expected delivery: Tomorrow',
      time: '2 days ago',
      read: true,
      priority: 'info'
    }
  ],
  SELLER: [
    {
      id: 1,
      type: 'order',
      icon: ShoppingBag,
      title: 'New Order Received',
      message: 'You have received a new order worth $156.99',
      time: '1 hour ago',
      read: false,
      priority: 'success'
    },
    {
      id: 2,
      type: 'product',
      icon: Package,
      title: 'Product Approved',
      message: 'Your product "Eco Bamboo Toothbrush" has been approved',
      time: '3 hours ago',
      read: false,
      priority: 'success'
    },
    {
      id: 3,
      type: 'alert',
      icon: AlertCircle,
      title: 'Low Stock Alert',
      message: 'Reusable Water Bottle is running low on stock',
      time: '6 hours ago',
      read: true,
      priority: 'warning'
    },
    {
      id: 4,
      type: 'analytics',
      icon: TrendingUp,
      title: 'Sales Milestone',
      message: 'Congratulations! You reached $5000 in sales this month',
      time: '1 day ago',
      read: true,
      priority: 'success'
    }
  ],
  ADMIN: [
    {
      id: 1,
      type: 'seller',
      icon: CheckCircle,
      title: 'New Seller Application',
      message: '3 new seller applications pending approval',
      time: '30 minutes ago',
      read: false,
      priority: 'warning'
    },
    {
      id: 2,
      type: 'product',
      icon: Package,
      title: 'Product Review Required',
      message: '5 products pending review and approval',
      time: '2 hours ago',
      read: false,
      priority: 'warning'
    },
    {
      id: 3,
      type: 'analytics',
      icon: TrendingUp,
      title: 'Platform Analytics',
      message: 'Monthly report is ready for review',
      time: '1 day ago',
      read: true,
      priority: 'info'
    },
    {
      id: 4,
      type: 'user',
      icon: AlertCircle,
      title: 'User Report',
      message: 'A product has been flagged for review by users',
      time: '2 days ago',
      read: true,
      priority: 'warning'
    }
  ]
};

export default function NotificationsPanel({ open, onOpenChange }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load notifications based on user role
    if (user?.role) {
      const roleNotifications = DUMMY_NOTIFICATIONS[user.role] || [];
      setNotifications(roleNotifications);
      setUnreadCount(roleNotifications.filter(n => !n.read).length);
    }
  }, [user]);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    const notif = notifications.find(n => n.id === id);
    if (notif && !notif.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-amber-600 bg-amber-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge className="bg-emerald-600">{unreadCount} new</Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            Stay updated with your latest activities
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4">
          {notifications.length > 0 && unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="w-full mb-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            >
              Mark all as read
            </Button>
          )}

          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-2">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Bell className="w-12 h-12 mb-2 opacity-20" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`
                        p-4 rounded-lg border transition-colors cursor-pointer
                        ${notification.read 
                          ? 'bg-white hover:bg-gray-50' 
                          : 'bg-emerald-50/50 border-emerald-200 hover:bg-emerald-50'
                        }
                      `}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div className={`p-2 rounded-full h-fit ${getPriorityColor(notification.priority)}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm">
                              {notification.title}
                            </h4>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 -mt-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
