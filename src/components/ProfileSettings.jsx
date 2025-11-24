import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { 
  Bell, Moon, Globe, Shield, User, 
  Leaf, AlertTriangle, Check, Loader2, 
  Smartphone, Mail, Lock, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

// Tab Component for cleaner organization
const TabButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

export default function ProfileSettings({ open, onOpenChange }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('notifications');
  const [isLoading, setIsLoading] = useState(false);
  
  // Settings state with more granular controls
  const [settings, setSettings] = useState({
    // Notifications
    emailOrder: true,
    emailPromo: false,
    pushOrder: true,
    pushPromo: false,
    carbonAlerts: true,
    
    // Security
    twoFactor: false,
    loginAlerts: true,
    
    // Appearance & Regional
    darkMode: false,
    language: 'en',
    currency: 'USD',
  });

  // Simulating loading initial data
  useEffect(() => {
    if (open) {
      const saved = localStorage.getItem('userSettings');
      if (saved) setSettings(JSON.parse(saved));
    }
  }, [open]);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('userSettings', JSON.stringify(settings));
      setIsLoading(false);
      toast.success('Preferences updated successfully', {
        description: 'Your changes have been applied to your account.',
        icon: <Check className="w-4 h-4 text-emerald-600" />,
      });
      onOpenChange(false);
    }, 1500);
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'notifications':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Email Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600" /> Email Preferences
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailOrder" className="text-sm font-medium">Order Updates</Label>
                    <p className="text-xs text-gray-500">Receive emails about your order status.</p>
                  </div>
                  <Switch
                    id="emailOrder"
                    checked={settings.emailOrder}
                    onCheckedChange={() => toggleSetting('emailOrder')}
                  />
                </div>
                <div className="h-px bg-gray-200" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailPromo" className="text-sm font-medium">Promotions & Deals</Label>
                    <p className="text-xs text-gray-500">Get updates on eco-friendly sales.</p>
                  </div>
                  <Switch
                    id="emailPromo"
                    checked={settings.emailPromo}
                    onCheckedChange={() => toggleSetting('emailPromo')}
                  />
                </div>
              </div>
            </div>

            {/* Push Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-600" /> Push Notifications
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="pushOrder" className="text-sm font-medium">Real-time Delivery</Label>
                    <p className="text-xs text-gray-500">Get notified when your package arrives.</p>
                  </div>
                  <Switch
                    id="pushOrder"
                    checked={settings.pushOrder}
                    onCheckedChange={() => toggleSetting('pushOrder')}
                  />
                </div>
              </div>
            </div>

            {/* Carbon Insights */}
            {user?.role !== 'ADMIN' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-600" /> Sustainability
                </h3>
                <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="carbonAlerts" className="text-sm font-medium text-emerald-900">Carbon Insights</Label>
                      <p className="text-xs text-emerald-700/80">Weekly summary of your carbon footprint savings.</p>
                    </div>
                    <Switch
                      id="carbonAlerts"
                      checked={settings.carbonAlerts}
                      onCheckedChange={() => toggleSetting('carbonAlerts')}
                      className="data-[state=checked]:bg-emerald-600"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex gap-3">
              <Shield className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-amber-900">Security Recommendation</h4>
                <p className="text-xs text-amber-700 mt-1">
                  We highly recommend enabling 2FA to protect your carbon credits and account data.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              <div className="p-4 flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                  <p className="text-xs text-gray-500">Secure your account with SMS code.</p>
                </div>
                <Switch
                  checked={settings.twoFactor}
                  onCheckedChange={() => toggleSetting('twoFactor')}
                />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Login Alerts</Label>
                  <p className="text-xs text-gray-500">Notify me of new login attempts.</p>
                </div>
                <Switch
                  checked={settings.loginAlerts}
                  onCheckedChange={() => toggleSetting('loginAlerts')}
                />
              </div>
              <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium cursor-pointer">Change Password</Label>
                  <p className="text-xs text-gray-500">Last changed 3 months ago</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="pt-4">
              <h3 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Danger Zone
              </h3>
              <div className="border border-red-200 rounded-xl p-4 bg-red-50">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-red-900">Delete Account</span>
                    <p className="text-xs text-red-700 mt-1">Permanently remove your data and carbon history.</p>
                  </div>
                  <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium flex items-center gap-2">
                       <Moon className="w-4 h-4" /> Dark Mode
                    </Label>
                    <p className="text-xs text-gray-500">Adjust the appearance to reduce eye strain.</p>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onCheckedChange={() => toggleSetting('darkMode')}
                  />
                </div>
             </div>

             <div className="space-y-4">
               <h3 className="text-sm font-semibold text-gray-900">Regional Settings</h3>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <Label className="text-xs text-gray-500 mb-1.5 block">Language</Label>
                   <select 
                     value={settings.language}
                     onChange={(e) => setSettings({...settings, language: e.target.value})}
                     className="w-full text-sm border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                   >
                     <option value="en">English (US)</option>
                     <option value="es">Español</option>
                     <option value="fr">Français</option>
                     <option value="de">Deutsch</option>
                   </select>
                 </div>
                 <div>
                   <Label className="text-xs text-gray-500 mb-1.5 block">Currency</Label>
                   <select 
                     value={settings.currency}
                     onChange={(e) => setSettings({...settings, currency: e.target.value})}
                     className="w-full text-sm border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                   >
                     <option value="USD">USD ($)</option>
                     <option value="EUR">EUR (€)</option>
                     <option value="GBP">GBP (£)</option>
                     <option value="INR">INR (₹)</option>
                   </select>
                 </div>
               </div>
             </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] p-0 gap-0 overflow-hidden bg-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <DialogTitle className="text-xl font-bold text-gray-900">Account Settings</DialogTitle>
          <DialogDescription className="text-gray-500 mt-1">
            Manage your profile, notifications, and security preferences.
          </DialogDescription>
        </div>

        <div className="flex h-[500px]">
          {/* Sidebar Navigation (Tabs) */}
          <div className="w-48 bg-gray-50 border-r border-gray-100 p-3 space-y-1 flex-shrink-0">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2 mt-2">
              General
            </div>
            <TabButton 
              active={activeTab === 'notifications'} 
              onClick={() => setActiveTab('notifications')} 
              icon={Bell} 
              label="Notifications" 
            />
            <TabButton 
              active={activeTab === 'appearance'} 
              onClick={() => setActiveTab('appearance')} 
              icon={Globe} 
              label="Preferences" 
            />
            
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2 mt-6">
              Account
            </div>
            <TabButton 
              active={activeTab === 'security'} 
              onClick={() => setActiveTab('security')} 
              icon={Shield} 
              label="Security" 
            />
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
            {renderContent()}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <div className="text-xs text-gray-500">
                Last synced: Just now
            </div>
            <div className="flex gap-3">
                <Button 
                    variant="outline" 
                    onClick={() => onOpenChange(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleSaveSettings} 
                    disabled={isLoading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm min-w-[100px]"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving
                        </>
                    ) : (
                        'Save Changes'
                    )}
                </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}