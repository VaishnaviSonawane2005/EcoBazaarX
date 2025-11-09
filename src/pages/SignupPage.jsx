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
import { Leaf, Mail, Lock, User, Phone, Chrome, Facebook as FacebookIcon, ShoppingBag, Store } from 'lucide-react';
import { toast } from 'sonner';

export default function SignupPage() {
  const navigate = useNavigate();
  const { user, signup, loginWithGoogle, loginWithFacebook } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'CUSTOMER',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const redirectMap = {
        ADMIN: '/admin',
        SELLER: '/seller',
        CUSTOMER: '/customer',
      };
      navigate(redirectMap[user.role]);
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
  const getStrengthColor = () => {
    if (passwordStrength < 25) return 'bg-red-500';
    if (passwordStrength < 50) return 'bg-orange-500';
    if (passwordStrength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

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
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone || undefined,
      });
      // Navigation is handled by AuthContext redirect in App.jsx
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = async (provider) => {
    setLoading(true);
    try {
      if (provider === 'google') {
        await loginWithGoogle();
      } else {
        await loginWithFacebook();
      }
      // Navigation is handled by AuthContext redirect in App.jsx
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
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
          <CardContent>
            {/* Social Signup Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSocialSignup('google')}
                disabled={loading}
              >
                <Chrome className="w-5 h-5 mr-2" />
                Sign up with Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSocialSignup('facebook')}
                disabled={loading}
              >
                <FacebookIcon className="w-5 h-5 mr-2" />
                Sign up with Facebook
              </Button>
            </div>

            <div className="relative mb-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
                or
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Account Type */}
              <div className="space-y-3">
                <Label>I want to</Label>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-emerald-50 transition-colors">
                    <RadioGroupItem value="CUSTOMER" id="customer" />
                    <Label htmlFor="customer" className="flex items-center gap-2 cursor-pointer flex-1">
                      <ShoppingBag className="w-5 h-5 text-emerald-600" />
                      <div>
                        <div>Shop as Customer</div>
                        <div className="text-xs text-gray-500">Browse and purchase eco-friendly products</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-emerald-50 transition-colors">
                    <RadioGroupItem value="SELLER" id="seller" />
                    <Label htmlFor="seller" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Store className="w-5 h-5 text-emerald-600" />
                      <div>
                        <div>Sell as Seller/Farmer</div>
                        <div className="text-xs text-gray-500">Requires admin approval</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Phone (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Progress value={passwordStrength} className="h-2" />
                      <span className="text-xs text-gray-600">{getStrengthLabel()}</span>
                    </div>
                    <div className={`h-1 rounded ${getStrengthColor()}`} style={{ width: `${passwordStrength}%` }}></div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              {formData.role === 'SELLER' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    Your seller account will be pending admin approval. You'll be notified once verified.
                  </p>
                </div>
              )}

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-600 hover:underline">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
