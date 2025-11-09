import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Bell, Moon, Globe, Shield, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileSettings({ open, onOpenChange }) {
  const { user } = useAuth();
  
  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    orderUpdates: true,
    carbonInsights: true,
    promotions: false,
    darkMode: false,
    language: 'en',
    twoFactor: false,
  });

  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    localStorage.setItem('userSettings', JSON.stringify(settings));
    toast.success('Settings saved successfully!');
    onOpenChange(false);
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your account preferences and notifications
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Notifications Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm">Notifications</h3>
            </div>
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notif" className="text-sm">Email Notifications</Label>
                <Switch
                  id="email-notif"
                  checked={settings.emailNotifications}
                  onCheckedChange={() => toggleSetting('emailNotifications')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notif" className="text-sm">Push Notifications</Label>
                <Switch
                  id="push-notif"
                  checked={settings.pushNotifications}
                  onCheckedChange={() => toggleSetting('pushNotifications')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="order-updates" className="text-sm">Order Updates</Label>
                <Switch
                  id="order-updates"
                  checked={settings.orderUpdates}
                  onCheckedChange={() => toggleSetting('orderUpdates')}
                />
              </div>
              {user?.role === 'CUSTOMER' && (
                <div className="flex items-center justify-between">
                  <Label htmlFor="carbon-insights" className="text-sm">Carbon Insights</Label>
                  <Switch
                    id="carbon-insights"
                    checked={settings.carbonInsights}
                    onCheckedChange={() => toggleSetting('carbonInsights')}
                  />
                </div>
              )}
              <div className="flex items-center justify-between">
                <Label htmlFor="promotions" className="text-sm">Promotional Emails</Label>
                <Switch
                  id="promotions"
                  checked={settings.promotions}
                  onCheckedChange={() => toggleSetting('promotions')}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Appearance Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm">Appearance</h3>
            </div>
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="text-sm">Dark Mode (Coming Soon)</Label>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={() => toggleSetting('darkMode')}
                  disabled
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Security Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm">Security</h3>
            </div>
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="two-factor" className="text-sm">Two-Factor Authentication</Label>
                <Switch
                  id="two-factor"
                  checked={settings.twoFactor}
                  onCheckedChange={() => toggleSetting('twoFactor')}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Language Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm">Language & Region</h3>
            </div>
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Language</Label>
                <select className="text-sm border rounded px-2 py-1">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveSettings} className="bg-emerald-600 hover:bg-emerald-700">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
