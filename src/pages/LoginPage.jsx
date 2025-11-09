import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { Leaf, Mail, Lock, Phone, Chrome, Facebook as FacebookIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ADMIN_CREDENTIALS } from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, login, loginWithGoogle, loginWithFacebook, loginWithOTP } = useAuth();
  
  const [emailLogin, setEmailLogin] = useState({ email: '', password: '' });
  const [phoneLogin, setPhoneLogin] = useState({ phone: '', otp: '' });
  const [otpSent, setOtpSent] = useState(false);
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

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await login(emailLogin.email, emailLogin.password);
      // Navigation is handled by AuthContext redirect in App.jsx
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
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

  const handleSendOTP = async () => {
    if (!phoneLogin.phone) {
      toast.error('Please enter phone number');
      return;
    }
    setLoading(true);
    try {
      // Mock OTP send
      await new Promise((resolve) => setTimeout(resolve, 500));
      setOtpSent(true);
      toast.success('OTP sent to your phone! Use: 123456');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginWithOTP(phoneLogin.phone, phoneLogin.otp);
      // Navigation is handled by AuthContext redirect in App.jsx
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
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
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Login to your account to continue shopping sustainably</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
              >
                <Chrome className="w-5 h-5 mr-2" />
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSocialLogin('facebook')}
                disabled={loading}
              >
                <FacebookIcon className="w-5 h-5 mr-2" />
                Continue with Facebook
              </Button>
            </div>

            <div className="relative mb-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
                or
              </span>
            </div>

            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="otp">OTP</TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        value={emailLogin.email}
                        onChange={(e) => setEmailLogin({ ...emailLogin, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={emailLogin.password}
                        onChange={(e) => setEmailLogin({ ...emailLogin, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="otp">
                <form onSubmit={handleOTPLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 234 567 8900"
                        className="pl-10"
                        value={phoneLogin.phone}
                        onChange={(e) => setPhoneLogin({ ...phoneLogin, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {!otpSent ? (
                    <Button
                      type="button"
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      onClick={handleSendOTP}
                      disabled={loading}
                    >
                      Send OTP
                    </Button>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="otp">Enter OTP</Label>
                        <Input
                          id="otp"
                          type="text"
                          placeholder="123456"
                          maxLength={6}
                          value={phoneLogin.otp}
                          onChange={(e) => setPhoneLogin({ ...phoneLogin, otp: e.target.value })}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify & Login'}
                      </Button>
                    </>
                  )}
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">🔐 Admin / Seller / Customer accounts are auto-detected</p>
              <div className="text-xs text-blue-700 space-y-1">
                <p>✅ <strong>Demo Admin:</strong> {ADMIN_CREDENTIALS.email} / {ADMIN_CREDENTIALS.password}</p>
                <p>✅ <strong>OTP Login:</strong> Use any phone + OTP: 123456</p>
                <p>✅ <strong>Social Login:</strong> Creates customer account</p>
              </div>
            </div>

            <div className="mt-6 text-center text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-emerald-600 hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
