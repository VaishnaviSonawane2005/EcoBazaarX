import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Leaf, ShoppingBag, BarChart3, Award, Recycle, TrendingDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-500 to-teal-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <Leaf className="w-16 h-16 text-white" />
              </div>
            </div>
            <h1 className="text-white mb-4">EcoBazaarX</h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Shop Sustainably. Track Your Carbon Footprint.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-emerald-600 hover:bg-emerald-50"
                onClick={() => navigate('/login')}
              >
                Login / Sign Up
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white/10"
                onClick={() => navigate('/marketplace')}
              >
                Explore Marketplace
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="mb-4">Why Choose EcoBazaarX?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of conscious consumers making a positive impact on our planet
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="mb-2">Eco-Friendly Products</h3>
            <p className="text-gray-600">
              Curated selection of sustainable products from verified eco-conscious sellers
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="mb-2">Carbon Tracking</h3>
            <p className="text-gray-600">
              Real-time insights into your carbon footprint with every purchase
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="mb-2">Rewards & Points</h3>
            <p className="text-gray-600">
              Earn carbon points for sustainable shopping and unlock exclusive benefits
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Recycle className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="mb-2">AI Recommendations</h3>
            <p className="text-gray-600">
              Smart product suggestions based on your eco-preferences and shopping history
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <TrendingDown className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="mb-2">Lower Emissions</h3>
            <p className="text-gray-600">
              Find low-carbon alternatives for every product you need
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="mb-2">Verified Sellers</h3>
            <p className="text-gray-600">
              All sellers are verified by our admin team for authenticity and sustainability
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-emerald-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-emerald-600 mb-2">1,247</div>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div>
              <div className="text-emerald-600 mb-2">856</div>
              <p className="text-gray-600">Eco Products</p>
            </div>
            <div>
              <div className="text-emerald-600 mb-2">8,234 kg</div>
              <p className="text-gray-600">CO₂ Saved</p>
            </div>
            <div>
              <div className="text-emerald-600 mb-2">89</div>
              <p className="text-gray-600">Verified Sellers</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-white mb-4">Ready to Make a Difference?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join EcoBazaarX today and start your journey towards sustainable shopping
          </p>
          <Button
            size="lg"
            className="bg-white text-emerald-600 hover:bg-emerald-50"
            onClick={() => navigate('/signup')}
          >
            Get Started Now
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Leaf className="w-6 h-6 mr-2" />
            <span>EcoBazaarX</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 EcoBazaarX. All rights reserved. | Carbon Footprint Aware E-Commerce Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
