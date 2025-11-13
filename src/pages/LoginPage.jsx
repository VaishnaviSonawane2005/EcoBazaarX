// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Leaf, Mail, Lock, Chrome, Facebook as FacebookIcon, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { ADMIN_CREDENTIALS } from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, login, loginWithGoogle, loginWithFacebook, loginWithOTP, sendOTP } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const redirectMap = { ADMIN: '/admin', SELLER: '/seller', USER: '/customer' };
      navigate(redirectMap[user.role] || '/');
    }
  }, [user, navigate]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(identifier, password);
    } catch (err) {
      // handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = async (provider) => {
    setLoading(true);
    try {
      if (provider === 'google') await loginWithGoogle();
      else await loginWithFacebook();
    } catch (err) {
      // handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!phone) {
      toast.error('Please enter phone number');
      return;
    }
    setLoading(true);
    try {
      await sendOTP(phone);
      setOtpSent(true);
    } catch (err) {
      // handled
    } finally {
      setLoading(false);
    }
  };

  const handleOTPLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginWithOTP(phone, otp);
    } catch (err) {
      // handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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

          <CardContent className="relative z-10">
            <div className="space-y-3 mb-6">
              <Button variant="outline" className="w-full" onClick={() => handleSocial('google')} disabled={loading}>
                <Chrome className="w-5 h-5 mr-2" /> Continue with Google
              </Button>
              <Button variant="outline" className="w-full" onClick={() => handleSocial('facebook')} disabled={loading}>
                <FacebookIcon className="w-5 h-5 mr-2" /> Continue with Facebook
              </Button>
            </div>

            <div className="relative mb-6 flex items-center justify-center">
              <Separator className="w-full" />
              <span className="absolute bg-white px-2 text-sm text-gray-500 z-20">or</span>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">Email or Username</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input id="identifier" className="pl-10" placeholder="email@example.com or username" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input id="password" type="password" className="pl-10" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
            </form>

            <div className="mt-6">
              <div className="text-sm text-gray-600 mb-2">Or login with OTP</div>
              {!otpSent ? (
                <div className="flex gap-2">
                  <Input placeholder="+91 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  <Button onClick={handleSendOTP} disabled={loading}>Send OTP</Button>
                </div>
              ) : (
                <form onSubmit={handleOTPLogin} className="mt-3 flex gap-2">
                  <Input placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} />
                  <Button type="submit" disabled={loading}>{loading ? 'Verifying...' : 'Verify & Login'}</Button>
                </form>
              )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg relative z-50">
              <p className="text-sm text-blue-800 mb-2">🔐 Demo/Admin info (mock)</p>
              <div className="text-xs text-blue-700 space-y-1">
                <div>✅ <strong>Admin:</strong> {ADMIN_CREDENTIALS.email} / {ADMIN_CREDENTIALS.password}</div>
                <div>✅ <strong>Mock user password:</strong> password123</div>
                <div>✅ <strong>OTP (mock):</strong> 123456</div>
              </div>
            </div>

            <div className="mt-6 text-center text-sm relative z-50">
              Don't have an account? <Link to="/signup" className="text-emerald-600 hover:underline pointer-events-auto relative z-50">Sign up</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
