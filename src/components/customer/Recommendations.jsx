// src/components/customer/Recommendations.jsx
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { recommendationService } from '../../services/recommendationService';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Sparkles, Leaf, ShoppingCart, MessageCircle, 
  Send, User, Bot, Search, Zap, Star, TrendingUp,
  Target, Shield, Truck, ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '../figma/ImageWithFallback';

// Premium product data
const PREMIUM_PRODUCTS = [
  { 
    id: 1, 
    name: "Organic Hemp T-Shirt", 
    description: "Crafted from 100% organic hemp with natural plant-based dyes. Features exceptional durability and breathability for everyday comfort.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    price: 35.00,
    carbonFootprint: 1.5,
    ecoRating: 4.8,
    stock: 50,
    sellerName: "EcoWear Collective",
    category: "Apparel",
    tags: ["sustainable", "organic", "biodegradable"],
    matchScore: 83
  },
  { 
    id: 2, 
    name: "Reclaimed Wood Desk", 
    description: "Artisan-crafted from repurposed scaffolding wood with low-VOC natural finish. Each piece tells a unique sustainability story.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    price: 450.00,
    carbonFootprint: 5.8,
    ecoRating: 4.9,
    stock: 15,
    sellerName: "Green Furniture Co",
    category: "Home Office",
    tags: ["recycled", "artisan", "office"],
    matchScore: 64
  },
  { 
    id: 3, 
    name: "Bamboo Toothbrush Pack", 
    description: "Biodegradable bamboo handles with BPA-free bristles. Zero-plastic packaging makes this the ultimate eco-conscious choice.",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
    price: 12.00,
    carbonFootprint: 0.1,
    ecoRating: 4.7,
    stock: 200,
    sellerName: "Zero Waste Living",
    category: "Personal Care",
    tags: ["biodegradable", "zero-waste", "bamboo"],
    matchScore: 78
  },
  { 
    id: 4, 
    name: "Solar-Powered LED Lamp", 
    description: "Energy-independent lighting solution with 50,000-hour LED lifespan. Waterproof design perfect for indoor and outdoor use.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
    price: 89.00,
    carbonFootprint: 3.2,
    ecoRating: 4.6,
    stock: 30,
    sellerName: "SolarTech Innovations",
    category: "Electronics",
    tags: ["solar", "energy-saving", "outdoor"],
    matchScore: 72
  },
  { 
    id: 5, 
    name: "Zero-Waste Shopping Bag", 
    description: "Premium heavy-duty canvas bag that folds compactly. Replaces hundreds of plastic bags over its lifetime.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    price: 15.00,
    carbonFootprint: 0.5,
    ecoRating: 4.5,
    stock: 100,
    sellerName: "Eco Essentials",
    category: "Accessories",
    tags: ["reusable", "zero-waste", "canvas"],
    matchScore: 85
  },
  { 
    id: 6, 
    name: "Organic Cotton Yoga Set", 
    description: "GOTS certified organic cotton activewear set. Breathable, comfortable, and perfect for sustainable fitness.",
    image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&h=400&fit=crop",
    price: 68.00,
    carbonFootprint: 2.1,
    ecoRating: 4.8,
    stock: 25,
    sellerName: "EcoActive Wear",
    category: "Activewear",
    tags: ["organic", "activewear", "GOTS"],
    matchScore: 79
  }
];

// AI Chatbot Component
const AIChatAssistant = ({ products, onAddToCart }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([{
      sender: 'bot',
      text: "Hello! I'm your AI shopping assistant. I can help you discover sustainable products tailored to your preferences. What are you looking for today?",
      products: [],
      timestamp: new Date()
    }]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const generateAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('shirt') || lowerMessage.includes('clothing') || lowerMessage.includes('wear')) {
      return {
        text: "I recommend our Organic Hemp T-Shirt. It's crafted from sustainable hemp that uses 50% less water than conventional cotton and is completely biodegradable.",
        products: products.filter(p => p.category === 'Apparel').slice(0, 2),
      };
    }
    
    if (lowerMessage.includes('desk') || lowerMessage.includes('office') || lowerMessage.includes('work')) {
      return {
        text: "For your workspace, consider our Reclaimed Wood Desk. Each piece is uniquely crafted from recycled scaffolding wood, preserving forests while offering durable functionality.",
        products: products.filter(p => p.category === 'Home Office').slice(0, 2),
      };
    }
    
    if (lowerMessage.includes('sustainable') || lowerMessage.includes('eco') || lowerMessage.includes('green')) {
      return {
        text: "Here are our top sustainable products across different categories. Each item is carefully selected for its environmental benefits and quality craftsmanship.",
        products: products.slice(0, 3),
      };
    }
    
    return {
      text: "I'd be happy to help you find sustainable products that match your needs. Here are some of our most popular eco-friendly items.",
      products: products.slice(0, 2),
    };
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    const newMessages = [...messages, { 
      sender: 'user', 
      text: userMessage, 
      timestamp: new Date() 
    }];
    
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        ...aiResponse,
        timestamp: new Date()
      }]);
      setLoading(false);
    }, 1000);
  };

  const QuickActions = () => (
    <div className="grid grid-cols-2 gap-2 mb-4">
      {[
        { icon: Search, text: "Sustainable", query: "Show sustainable products" },
        { icon: Leaf, text: "Low Carbon", query: "Low carbon footprint products" },
        { icon: Target, text: "Clothing", query: "Eco-friendly clothing" },
        { icon: Zap, text: "Top Picks", query: "Your top recommendations" }
      ].map((action, index) => (
        <button
          key={index}
          onClick={() => setInput(action.query)}
          className="flex items-center justify-center p-2 bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all text-xs font-medium"
        >
          <action.icon className="w-3 h-3 text-green-600 mr-1" />
          <span className="text-gray-700">{action.text}</span>
        </button>
      ))}
    </div>
  );

  const ProductSuggestion = ({ product }) => (
    <div 
      className="flex gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer group"
      onClick={() => onAddToCart(product)}
    >
      <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-gray-900 truncate">{product.name}</h4>
        <p className="text-green-600 font-bold text-sm">${product.price}</p>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
            {product.carbonFootprint} kg CO₂
          </Badge>
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span className="text-xs text-gray-600">{product.ecoRating}</span>
        </div>
      </div>
    </div>
  );

  const ChatBubble = ({ message }) => {
    const isBot = message.sender === 'bot';
    
    return (
      <div className={`flex gap-3 mb-4 ${isBot ? '' : 'flex-row-reverse'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isBot ? 'bg-green-100' : 'bg-green-500'
        }`}>
          {isBot ? (
            <Bot className="w-4 h-4 text-green-600" />
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
        </div>
        
        <div className={`flex-1 max-w-[85%] ${isBot ? '' : 'text-right'}`}>
          <div className={`inline-block p-3 rounded-2xl ${
            isBot 
              ? 'bg-white border border-gray-200 rounded-tl-none' 
              : 'bg-green-500 text-white rounded-tr-none'
          }`}>
            <p className="text-sm leading-relaxed">{message.text}</p>
          </div>
          
          {isBot && message.products && message.products.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.products.map(product => (
                <ProductSuggestion key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Shopping Assistant</h3>
            <p className="text-sm text-gray-600">Get personalized recommendations</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto min-h-0">
        {messages.map((message, index) => (
          <ChatBubble key={index} message={message} />
        ))}
        
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200">
        <QuickActions />
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about sustainable products..."
            className="flex-1 p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <Button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-green-600 hover:bg-green-700 px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

// Match Score Component
const MatchScore = ({ score }) => (
  <div className="flex items-center gap-2">
    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-500"
        style={{ width: `${score}%` }}
      />
    </div>
    <span className="text-sm font-semibold text-gray-700 min-w-8">{score}%</span>
  </div>
);

// Main Recommendations Component
export default function Recommendations() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        const mockRecommendations = PREMIUM_PRODUCTS.map(product => ({
          product,
          score: product.matchScore / 100,
          reason: [
            "Matches your sustainable fashion preferences",
            "Aligns with your low carbon footprint goals",
            "Popular among eco-conscious shoppers like you",
            "High eco-rating meets your standards",
            "Fits your previous purchase patterns",
            "Recommended based on your browsing history"
          ][product.id % 6]
        }));
        setRecommendations(mockRecommendations);
        setLoading(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to load recommendations', err);
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`Added ${product.name} to cart`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">AI-Powered Recommendations</h1>
                <p className="text-lg text-gray-600">Personalized eco-friendly product suggestions with intelligent shopping assistant</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid xl:grid-cols-4 gap-8">
          {/* Main Recommendations Grid - 3/4 width */}
          <div className="xl:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Personalized For You</h2>
                <p className="text-gray-600 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  Based on your preferences and shopping behavior
                </p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700 text-sm">
                {recommendations.length} products
              </Badge>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-64 bg-gray-200 rounded-lg" />
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-3" />
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {recommendations.map(({ product, score, reason }) => (
                  <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden h-full flex flex-col">
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <MatchScore score={product.matchScore} />
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-white/90 backdrop-blur-sm text-gray-900 border-0">
                          <Star className="w-3 h-3 mr-1 text-yellow-400 fill-yellow-400" />
                          {product.ecoRating}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg text-gray-900 leading-tight flex-1 pr-2">{product.name}</h3>
                        <span className="text-2xl font-bold text-green-600 flex-shrink-0">${product.price}</span>
                      </div>

                      <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">{product.description}</p>

                      <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <p className="text-sm text-blue-800 leading-tight">{reason}</p>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Leaf className="w-4 h-4 text-green-600" />
                          <span>{product.carbonFootprint} kg CO₂</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span>{product.sellerName}</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-6 pt-0">
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 h-12 text-base font-semibold"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - 1/4 width */}
          <div className="xl:col-span-1 space-y-6">
            <AIChatAssistant 
              products={PREMIUM_PRODUCTS}
              onAddToCart={handleAddToCart}
            />

            {/* Eco Impact Card */}
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Your Eco Impact</h3>
                    <p className="text-green-100 text-sm">Sustainable shopping achievements</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                    <span className="text-green-100">Carbon Saved</span>
                    <Badge variant="secondary" className="bg-white text-green-600 font-semibold">
                      12.3 kg
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                    <span className="text-green-100">Eco Products</span>
                    <Badge variant="secondary" className="bg-white text-green-600 font-semibold">
                      8 items
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                    <span className="text-green-100">Sustainability Score</span>
                    <Badge variant="secondary" className="bg-white text-green-600 font-semibold">
                      87%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}