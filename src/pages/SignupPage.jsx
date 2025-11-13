// src/pages/SignupPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Separator } from '../components/ui/separator';
import { Progress } from '../components/ui/progress';
import { Leaf, Mail, Lock, User, Phone, ShoppingBag, Store } from 'lucide-react';
import { toast } from 'sonner';

export default function SignupPage() {
  const navigate = useNavigate();
  const { user, signup } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const redirectMap = { ADMIN: '/admin', SELLER: '/seller', USER: '/customer' };
      navigate(redirectMap[user.role] || '/');
    }
  }, [user, navigate]);

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 12.5;
    if (/[!@#$%^&*]/.test(password)) strength += 12.5;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const getStrengthLabel = () => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordStrength < 50) {
      toast.error('Please choose a stronger password');
      return;
    }

    setLoading(true);
    try {
      await signup({
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
        role: formData.role,
      });
    } catch (err) {
      // handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-emerald-600">
            <Leaf className="w-8 h-8" />
            <span className="text-2xl">EcoBazaarX</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Your Account</CardTitle>
            <CardDescription>Join the sustainable shopping revolution</CardDescription>
          </CardHeader>

          <CardContent className="relative z-10">
            <div className="relative mb-6 flex items-center justify-center">
              <Separator className="w-full" />
              <span className="absolute bg-white px-2 text-sm text-gray-500 z-20">Sign up</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input id="username" className="pl-10" placeholder="john_doe" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input id="email" type="email" placeholder="you@example.com" className="pl-10" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input id="phone" type="tel" placeholder="+91 9876543210" className="pl-10" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>

              <div className="space-y-3">
                <Label>I want to</Label>
                <RadioGroup value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-emerald-50 transition-colors">
                    <RadioGroupItem value="USER" id="user" />
                    <Label htmlFor="user" className="flex items-center gap-2 cursor-pointer flex-1">
                      <ShoppingBag className="w-5 h-5 text-emerald-600" />
                      <div>Shop as Customer</div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-emerald-50 transition-colors">
                    <RadioGroupItem value="SELLER" id="seller" />
                    <Label htmlFor="seller" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Store className="w-5 h-5 text-emerald-600" />
                      <div>Sell as Seller</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input id="password" type="password" placeholder="••••••••" className="pl-10" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                </div>
                {formData.password && <div className="space-y-1"><Progress value={passwordStrength} className="h-2" /><span className="text-xs text-gray-600">{getStrengthLabel()}</span></div>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input id="confirmPassword" type="password" placeholder="••••••••" className="pl-10" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required />
                </div>
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>{loading ? 'Creating Account...' : 'Create Account'}</Button>
            </form>

            <div className="mt-6 text-center text-sm relative z-50">
              Already have an account? <Link to="/login" className="text-emerald-600 hover:underline pointer-events-auto relative z-50">Login</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
